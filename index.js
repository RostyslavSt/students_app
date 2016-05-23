// Yout js code goes here
'use strict';
var MIN = 1;
var MAX = 99;
var iterator;
var courseNumber = 3;
$(function() {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $studentTableBody = $('tbody');
    $studentDataContainer.hide();
    $studentFormContainer.hide();
    $('.student-listing-container div.alert-success').hide();
    function studentRowView(student) {
        var $firstNameTd = $('<td>').html(student.first_name);
        var $lastNameTd = $('<td>').html(student.last_name);
        var $studentShowAnchor = $('<a>').html('Show').addClass('btn btn-default')
                                                                 .attr('href', '#');
        var $studentEditAnchor = $('<a>').html('Edit').addClass('btn btn-primary')
                                                                 .attr('href', '#');
        var $studentDeleteAnchor = $('<a>').html('Delete').addClass('btn btn-danger')
                                                                 .attr('href', '#');

        var $actionsTd = $('<td>').data('id', student.id).
        			append($studentShowAnchor, $studentEditAnchor, $studentDeleteAnchor);
        return $('<tr>').append($firstNameTd, $lastNameTd, $actionsTd);
    }
    $studentTableBody.empty();
    
    $.get({
        url: 'https://spalah-js-students.herokuapp.com/students',
        contentType: "application/json",
        dataType: 'json',
        success: function(students) {
            $.each(students.data, function(index, student) {
                $studentTableBody.append(studentRowView(student));
            });
        }
    });

	//< button EDIT on list student
	$(document).on('click', '.student-listing-container .btn-primary', function() {
		$studentListingContainer.fadeOut(500, function() {
	    $studentFormContainer.fadeIn();
    	});

    	$('div.alert-danger').remove();
    	
    	var studentId = $(this).parent().data('id');
    	$('input.student-course').parent().remove(); //remove field courses to create once more
    	function downloadCourses(course) {
    		var courseNumber = 1;
    		var $newDiv = $('<div>').addClass('form-group');
	        var $divLabel = $('<label>').html('Course ' + courseNumber);
	        var $divInput = $('<input>').addClass('form-control student-course').
	                                        attr("name", "courses[]").
	                                        	val(course);
	        var $divAnchor = $('<a>').addClass('remove-course').attr('href', '#').
	        							html('Remove course');
	       $($newDiv.append($divLabel, $divInput,
	                    $divAnchor).insertBefore('form .form-group:last'));
	       courseNumber++;
    	}

    	$.get({
    		url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
    		contentType: 'application/json',
    		dataType: 'json',
    		success: function(student) {
    			$('input.first-name').val(student.data.first_name);
    			$('input.last-name').val(student.data.last_name);
    			var newAge = $('select.student-age');
    			for (iterator = MIN; iterator <= MAX; iterator++) {
    					if (iterator === student.data.age) {
    						newAge.append($('<option>').html(iterator).
    						attr('selected', 'selected'));
    					} else {newAge.append($('<option>').html(iterator));}
    					
    			}
    			if (student.data.at_university) {
    				$('input.student-at-university').attr('checked', '');
    				// alert(student.data.at_university);
    			}
    			$.each(student.data.courses, function(index, course){
    				downloadCourses(course);
    			});
    		}
    	});
    });

    // button EDIT on list student >


    // < button Delete
    $(document).on('click', '.student-listing-container .btn-danger', function() {
    	var studentId = $(this).parent().data('id');
    	var confirmDelete = confirm('Are you sure to delee this student?');
        if (confirmDelete) {
        	$(this).parent().parent().fadeOut(500, function() {
        			$('.student-listing-container div.alert-success').
                            html('Student deleted successfully').fadeIn(500);
	        				});
        	    	
	        $.ajax({
	            url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
	            contentType: "application/json",
	            dataType: 'json',
	            type: 'DELETE',
	            success: function() {
	            	
	            } 
	        });
	    }
    }); // button delete >

       // < START BUTTON SHOW
    $(document).on('click', '.student-listing-container .btn-default', function() {
    	$studentListingContainer.fadeOut(500, function() {
    		$studentDataContainer.fadeIn(500);
    	});

    	$('div.alert-success').hide(); // hide div

    	var studentId = $(this).parent().data('id');
    	$('div.student-data-group span').empty();
    	
    	function createCourses(student) {
    		$('.student-data-group').has('.course-group').empty();
    		if (student.data.courses.length > 0) {
    			$.each(student.data.courses, function (index, course) {
    				$('div.student-data-group:last').append($('<div>').addClass('course-group').
    				append($('<b>').html('Course  ' + (index + 1) + ': ')).
    				append($('<span>').html(course)));
    			});
    		} else {
    			$('div.student-data-group:last').append($('<div>').addClass('course-group').
    				append($('<b>').html('Courses: ')).
    				append($('<span>').html('No courses')));
    			}
    	}

	     $.get({
	        url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
	        contentType: "application/json",
	        dataType: 'json',
	        success: function(student) {
	        	$('span.student-full-name').html(student.data.first_name + ' ' 
	        		+ student.data.last_name);
	        	$('span.student-age').html(student.data.age);
	        	$('span.student-at-university').html(student.data.at_university ? 'Yes' : 'No');
	        	createCourses(student);
	        	}
	     });

	});//END BUTTON SHOW >

    // < button BACK for SHOW---
		  	$(document).on('click', 'div.student-data-container a.btn-default', function() {
		  		$studentTableBody.empty();
		  		$studentDataContainer.fadeOut(500, function() {
		  			$studentListingContainer.fadeIn(500);
		  		});

		  		$.get({
		        url: 'https://spalah-js-students.herokuapp.com/students',
		        contentType: "application/json",
		        dataType: 'json',
			        success: function(students) {
			            $.each(students.data, function(index, student) {
			                $studentTableBody.append(studentRowView(student));
			            });
			        }
		    	});
			});
	// ----button BACK for SHOW >

    // < "Add Student"
    $(document).on('click', '.student-listing-container .btn-success', function() {
    	
    	$studentListingContainer.fadeOut(500, function() {
    		$studentFormContainer.fadeIn(500);
    	});
    	// $studentFormContainer.empty();
    	$('div.alert-danger').remove();
    	for (iterator = MIN; iterator < MAX; iterator++) {
    		$('.student-form-container .student-age').append($('<option>').html(iterator));
    	} //create a list of age
    	// $.each('div .student-course', function(index, course) {

    	// });
    });
   		//  < push submit	   
   $('form').submit(function(event) {	
	   var listCourses = $('input.student-course');
       var arrayCourses = [];
       $.each(listCourses, function(index, course){
            arrayCourses.push(course.value);
       });
       // console.log(arrayCourses);
		var new_student = {student:
			{
		        first_name: $('input.first-name').val(),
		        last_name: $('input.last-name').val(),
		        age: $('select.student-age').val(),
		        courses: arrayCourses,
		        at_university: $('input.student-at-university').is(':checked')
			}
		};

		$.post('https://spalah-js-students.herokuapp.com/students', 
			new_student,
			function(data) {
				if (data.errors) {
                    $('.alert-danger').fadeIn(500);
                    $.each(data.errors, function(index, error) {
                    	console.log(error);
                        var $error_li = $('<li>').addClass('list-group-item').text(error);
                        $('ul').append($error_li);
                    });
                } else {
                	$studentFormContainer.fadeOut(500, function() {
		  			$studentListingContainer.fadeIn(500);
				  		});
			  		$('.student-listing-container .alert-success').fadeIn(500);
			  		$studentTableBody.empty();
			  		
			  		$.get({
			        url: 'https://spalah-js-students.herokuapp.com/students',
			        contentType: "application/json",
			        dataType: 'json',
				        success: function(students) {
				            $.each(students.data, function(index, student) {
				                $studentTableBody.append(studentRowView(student));
				            });
				        }
			    	});
                }
              });
	  event.preventDefault();
	});
   // push submitt >

   // < add course---
   $(document).on('click', 'a.add-course', function() {
   		// var courseNumber = 3;
        var $newDiv = $('<div>').addClass('form-group');
        var $divLabel = $('<label>').html('Course ' + courseNumber);
        var $divInput = $('<input>').addClass('form-control student-course').
                                        attr("name", "courses[]");
        var $divAnchor = $('<a>').addClass('remove-course').attr('href', '#').
        							html('Remove course');
       $($newDiv.append($divLabel, $divInput,
                    $divAnchor).insertBefore('form .form-group:last'));
       courseNumber++;
       event.preventDefault();
   });
  		 //---add course >
   
   		// < remove course---
   $(document).on('click','form .remove-course', function() {
   	$(this).parent().fadeOut(1000);
   	courseNumber--;
   	event.preventDefault();
   });
  		//---remove course >

  		// <----button BACK---
  	$(document).on('click', 'a.btn-default:last', function() {
  		$studentFormContainer.fadeOut(500, function() {
  			$studentListingContainer.fadeIn(500);
  		});

  		$studentTableBody.empty();

  		$.get({
        url: 'https://spalah-js-students.herokuapp.com/students',
        contentType: "application/json",
        dataType: 'json',
	        success: function(students) {
	            $.each(students.data, function(index, student) {
	                $studentTableBody.append(studentRowView(student));
	            });
	        }
    	});
	});
  		// ----button BACK--->


   //END button "Add Student" >

});


