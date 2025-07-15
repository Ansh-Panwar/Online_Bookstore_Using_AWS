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

# EC2 Instance
resource "aws_instance" "bookstore" {
  ami                    = "ami-0c02fb55956c7d316" # Amazon Linux 2 (update if needed)
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.bookstore_sg.id]
  key_name               = var.key_pair_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              curl -sL https://rpm.nodesource.com/setup_18.x | bash -
              yum install -y nodejs git
              git clone https://github.com/Ansh-Panwar/Online_Bookstore_Using_AWS.git
              cd Online_Bookstore_Using_AWS/bookstore
              npm install
              npm run build
              npm run start &
              EOF

  tags = {
    Name = "bookstore-instance"
  }
}

# Allocate a static Elastic IP
resource "aws_eip" "bookstore_eip" {
  vpc = true
  depends_on = [aws_internet_gateway.igw]   # ensure IGW exists first
}

# Attach it to the EC2 instance
resource "aws_eip_association" "bookstore_eip_assoc" {
  instance_id   = aws_instance.bookstore.id
  allocation_id = aws_eip.bookstore_eip.id
}

# AWS Budget (Simulates AWS Trusted Advisor Cost Alert)
resource "aws_budgets_budget" "cost_alert" {
  name              = "monthly-cost-budget"
  budget_type       = "COST"
  limit_amount      = "5"
  limit_unit        = "USD"
  time_unit         = "MONTHLY"

  cost_types {
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
    comparison_operator = "GREATER_THAN"
    threshold           = 80
    threshold_type      = "PERCENTAGE"
    notification_type   = "ACTUAL"

    subscriber {
      address           = "anshpanwar197@gmail.com"  # <-- Replace with your email
      subscription_type = "EMAIL"
    }
  }
}