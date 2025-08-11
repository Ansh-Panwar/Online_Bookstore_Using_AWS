provider "aws" {
  region = "us-east-1" 
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "bookstore-vpc"
  }
}

# Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags = {
    Name = "bookstore-subnet"
  }
}

# Second Public Subnet
resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1b" # different AZ
  tags = {
    Name = "bookstore-subnet-2"
  }
}

# Associate Route Table with second subnet
resource "aws_route_table_association" "rta_2" {
  subnet_id      = aws_subnet.public_2.id
  route_table_id = aws_route_table.rt.id
}


# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

# Route Table
resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Associate Route Table
resource "aws_route_table_association" "rta" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.rt.id
}

# Security Group
resource "aws_security_group" "bookstore_sg" {
  name        = "bookstore-sg"
  description = "Allow HTTP and SSH"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bookstore-sg"
  }
}

resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow HTTP to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "bookstore_tg" {
  name        = "bookstore-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    path                = "/"
    port                = "3000"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group_attachment" "bookstore_attach" {
  target_group_arn = aws_lb_target_group.bookstore_tg.arn
  target_id        = aws_instance.bookstore.id
  port             = 3000
}

resource "aws_lb" "bookstore_alb" {
  name               = "bookstore-alb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [
    aws_subnet.public.id,
    aws_subnet.public_2.id
  ]
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.bookstore_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.bookstore_tg.arn
  }
}


# EC2 Instance
resource "aws_instance" "bookstore" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2 (update as needed)
  instance_type = "t2.micro"
  key_name      = "bookstore-key"
  subnet_id     = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.bookstore_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y git
    curl -sL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs

    cd /home/ec2-user
    git clone https://github.com/Ansh-Panwar/Online_Bookstore_Using_AWS.git
    cd Online_Bookstore_Using_AWS/bookstore
    npm install
    npm run build
    nohup npx next start -H 0.0.0.0 -p 3000 &
  EOF

  tags = {
    Name = "bookstore-instance"
  }
}


# Allocate a static Elastic IP
resource "aws_eip" "bookstore_eip" {
  domain = "vpc"

  /*lifecycle {
    prevent_destroy = true
  }*/
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.bookstore.id
  allocation_id = aws_eip.bookstore_eip.id
}

# CloudWatch Alarm for High CPU Utilization
resource "aws_cloudwatch_metric_alarm" "high_cpu_alarm" {
  alarm_name          = "HighCPUUtilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "70"
  alarm_description   = "This alarm triggers if CPU usage is above 70% for 4 minutes."
  alarm_actions       = [aws_sns_topic.alerts.arn]
  dimensions = {
    InstanceId = aws_instance.bookstore.id
  }
}

# SNS Topic for Alerts
resource "aws_sns_topic" "alerts" {
  name = "cloudwatch-alerts"
}

resource "aws_sns_topic_subscription" "email_alert" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "anshpanwar197@gmail.com" 
}

# IAM Role for Lambda Function to Stop EC2 Instance
resource "aws_iam_role" "lambda_stop_ec2_role" {
  name = "lambda-stop-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach the necessary policies to the IAM role
resource "aws_iam_role_policy_attachment" "lambda_ec2_full" {
  role       = aws_iam_role.lambda_stop_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2FullAccess"
}

# Lambda Function to Stop Idle EC2 Instance
resource "aws_lambda_function" "stop_idle" {
  function_name = "StopIdleEC2"
  handler       = "stop_idle.lambda_handler"      # Python file is stop_idle.py
  runtime       = "python3.10"
  filename      = "${path.module}/lambda/function.zip"  
  role          = aws_iam_role.lambda_stop_ec2_role.arn
  timeout       = 30

  source_code_hash = filebase64sha256("${path.module}/lambda/function.zip")
}


# CloudWatch Event Rule to trigger Lambda daily
resource "aws_cloudwatch_event_rule" "daily_shutdown" {
  name                = "daily-ec2-shutdown"
  schedule_expression = "cron(0 22 * * ? *)"  # 10 PM UTC daily
}

resource "aws_cloudwatch_event_target" "lambda_trigger" {
  rule      = aws_cloudwatch_event_rule.daily_shutdown.name
  target_id = "StopIdleEC2"
  arn       = aws_lambda_function.stop_idle.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.stop_idle.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_shutdown.arn
}


# AWS Budget (Simulates AWS Trusted Advisor Cost Alert)
resource "aws_budgets_budget" "cost_alert" {
  name         = "monthly-cost-budget"
  budget_type  = "COST"
  limit_unit   = "USD"
  limit_amount = "5"
  time_unit    = "MONTHLY"

  cost_types {                       # unchanged
    include_credit             = true
    include_discount           = true
    include_other_subscription = true
    include_recurring          = true
    include_refund             = true
    include_subscription       = true
    include_support            = true
    include_tax                = true
    include_upfront            = true
    use_amortized              = false
    use_blended                = false
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"

    ## NEW STYLE — just pass e‑mail(s) as a list
    subscriber_email_addresses = ["anshpanwar197@gmail.com"]
    # subscriber_sns_topic_arns = ["arn:aws:sns:..."]   # optional
  }
}
