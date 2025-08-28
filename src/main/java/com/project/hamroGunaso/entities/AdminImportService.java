package com.project.hamroGunaso.entities;


import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.hamroGunaso.ENUM.EmailStatus;
import com.project.hamroGunaso.ENUM.IdentityStatus;
import com.project.hamroGunaso.ENUM.Role;
import com.project.hamroGunaso.repository.UserRepository;

@Service
public class AdminImportService implements CommandLineRunner{
  private final UserRepository userRepo;
  private final PasswordEncoder passEnco;
  
  public AdminImportService(UserRepository userRepo, PasswordEncoder passEnco) {
	  this.userRepo = userRepo;
	  this.passEnco =passEnco;
  }
  
  @Override
   public void run(String... args) {
	  String adminEmail = "admin44@gmail.com";
	  if(!userRepo.existsByEmail(adminEmail)) {
		  User admin = User.builder()
				  
				    .email(adminEmail)
				    .fullName("Admin")
				    .password(passEnco.encode("admin123"))
				    .role(Role.ADMIN)
				    .emailStatus(EmailStatus.VERIFIED)
				    .identityStatus(IdentityStatus.VERIFIED)
				    .build();
              userRepo.save(admin);
	  }
  }
}
