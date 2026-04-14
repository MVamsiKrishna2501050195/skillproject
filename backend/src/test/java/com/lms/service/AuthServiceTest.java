package com.lms.service;

import com.lms.dto.LoginRequest;
import com.lms.dto.RegisterRequest;
import com.lms.dto.UserDTO;
import com.lms.entity.User;
import com.lms.repository.UserRepository;
import com.lms.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    private JwtUtil jwtUtil;

    private AuthService authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secretKey", "8a9b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9");
        authService = new AuthService(userRepository, authenticationManager, passwordEncoder, jwtUtil);
        
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("Test User");
        mockUser.setEmail("test@test.com");
        mockUser.setPassword("encoded_password");
        mockUser.setRole(User.Role.STUDENT);
    }

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Test User");
        req.setEmail("test@test.com");
        req.setPassword("raw_password");
        req.setRole("STUDENT");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        UserDTO result = authService.register(req);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        assertNotNull(result.getToken()); // Real JWT generated
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ThrowsExceptionWhenEmailExists() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@test.com");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(req));
        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("raw_password");

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(mockUser));

        UserDTO result = authService.login(req);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        assertNotNull(result.getToken()); // Real JWT generated
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_ThrowsExceptionOnBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@test.com");
        req.setPassword("wrong_password");

        doThrow(new RuntimeException("Bad credentials"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.login(req));
        assertEquals("Invalid email or password", exception.getMessage());
    }
}
