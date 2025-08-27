package com.project.hamroGunaso.exception;

public class OtpRateLimitException  extends RuntimeException{
  public OtpRateLimitException(String message) {
	  super(message);
  }
}
