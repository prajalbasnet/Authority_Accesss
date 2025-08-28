package com.project.hamroGunaso.responseDTO;


import lombok.*;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
