package com.project.hmaroGunaso.util;

import java.security.SecureRandom;
import lombok.experimental.UtilityClass;

@UtilityClass
public class OtpUtil {
    public String generateRandomOtp(int length) {
        String numbers = "0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < length; i++) {
            otp.append(numbers.charAt(random.nextInt(numbers.length())));
        }
        return otp.toString();
    }
}
