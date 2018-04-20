package com.dmpgenerator.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;

@ControllerAdvice
class GlobalControllerExceptionHandler {

	@ResponseStatus(HttpStatus.NOT_FOUND)
	@ExceptionHandler(EntityNotFoundException.class)
	public String handleConflict(EntityNotFoundException e) {
		return e.getMessage();
	}
}
