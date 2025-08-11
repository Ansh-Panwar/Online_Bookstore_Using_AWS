output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.bookstore.public_ip
}

output "bookstore_public_ip" {
  value = aws_eip.bookstore_eip.public_ip
}

output "alb_dns" {
  value = aws_lb.bookstore_alb.dns_name
}
