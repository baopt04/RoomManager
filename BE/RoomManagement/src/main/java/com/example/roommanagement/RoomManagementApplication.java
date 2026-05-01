package com.example.roommanagement;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.nio.file.Files;
import java.nio.file.Path;

@EnableAsync
@SpringBootApplication
@EnableScheduling
public class RoomManagementApplication {
	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(RoomManagementApplication.class, args);
	}

	/**
	 * Spring Boot does not load a root {@code .env} by default. Apply entries as system properties
	 * so {@code application.properties} placeholders like {@code ${JWT_SECRET}} resolve. OS env vars win.
	 */
	private static void loadDotEnv() {
		String userDir = System.getProperty("user.dir");
		Path[] candidates = new Path[] {
				Path.of(userDir, ".env"),
				Path.of(userDir).resolve("../.env").normalize(),
				Path.of(userDir).resolve("../../.env").normalize(),
				Path.of(userDir).resolve("../../../.env").normalize(),
		};
		for (Path envFile : candidates) {
			if (!Files.isRegularFile(envFile)) {
				continue;
			}
			Dotenv dotenv = Dotenv.configure()
					.directory(envFile.getParent().toString())
					.filename(envFile.getFileName().toString())
					.ignoreIfMalformed()
					.load();
			dotenv.entries().forEach(e -> {
				String key = e.getKey();
				if (System.getenv(key) == null && System.getProperty(key) == null) {
					System.setProperty(key, e.getValue());
				}
			});
			return;
		}
	}

}
