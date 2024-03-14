terraform {
  backend "s3" {
    bucket         = "terraform-backend-561678142736"
    region         = "ap-northeast-1"
    key            = "github-action-test.tfstate"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.40.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_dynamodb_table" "test" {
  name         = "github-action-test-${terraform.workspace}"
  hash_key     = "ID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "ID"
    type = "S"
  }
}

resource "aws_s3_bucket" "test" {
  bucket = "github-action-test-${terraform.workspace}"
}

output timestamp {
  value = terraform.workspace == "prod" ? timestamp() : 0
}
