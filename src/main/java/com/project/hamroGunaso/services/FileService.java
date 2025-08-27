package com.project.hamroGunaso.services;

import com.project.hamroGunaso.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class FileService {

    private final Path root = Paths.get("uploads");

    //  save image only (JPG, PNG, JPEG)
    public String saveImageFile(MultipartFile file, String folder) {
        validateFile(file, new String[]{"image/jpeg", "image/png", "image/jpg"});
        return save(file, folder);
    }

    //  save PDF file (optional, for CV etc.)
    public String savePdfFile(MultipartFile file, String folder) {
        validateFile(file, new String[]{"application/pdf"});
        return save(file, folder);
    }

    // ---------- private helpers ----------
    private void validateFile(MultipartFile file, String[] allowedTypes) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File missing");
        }
        String contentType = file.getContentType();
        boolean valid = false;
        for (String type : allowedTypes) {
            if (type.equalsIgnoreCase(contentType)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            throw new BadRequestException("Invalid file type. Allowed: " + String.join(", ", allowedTypes));
        }
    }

    private String save(MultipartFile file, String folder) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path folderPath = root.resolve(folder);
            Files.createDirectories(folderPath);
            Path filePath = folderPath.resolve(fileName);
            Files.write(filePath, file.getBytes());
            return fileName; // only save filename in DB
        } catch (IOException e) {
            throw new BadRequestException("Failed to save file: " + e.getMessage());
        }
    }

    public Resource loadFile(String folder, String fileName) {
        try {
            Path filePath = root.resolve(folder).resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new BadRequestException("File not found");
            }
        } catch (MalformedURLException e) {
            throw new BadRequestException("Invalid file path");
        }
    }
}
