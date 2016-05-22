// Yout js code goes here
'use strict';
var MIN = 1;
var MAX = 99;
var iterator;
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
    // start button Delete
    $(document).on('click', '.student-listing-container .btn-danger', function() {
    	var studentId = $(this).parent().data('id');
    	var confirmDelete = confirm('Are you sure to delee this student?');
        if (confirmDelete) {
        	$(this).parent().parent().fadeOut(1000, function() {
        		$('.student-listing-container div.alert-success').
                            html('Student deleted successfully').fadeIn(1000);
	        });
        	
	        $.ajax({
	            url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
	            contentType: "application/json",
	            dataType: 'json',
	            type: 'DELETE',
	            success: function() {
	            	// $('tbody tr').empty();
	            	// $('.student-listing-container div.alert-success').
	            	// 		html('Student: ' + studentId);
	            	// $('.student-listing-container div.alert-success').
	            	//  		html('Student:  ' + $(this).parent().html() + 
	            	//  			' ' + $('td:first').html() + ' was successfully deleted');
	            } 
	        });
	    }
    }); //end button delete

    
    


    // start button show
    $(document).on('click', '.student-listing-container .btn-default', function() {
    	$studentListingContainer.fadeOut(500, function() {
    		$studentDataContainer.fadeIn(500);
    	});
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
	});//END SHOW


    //START "Add Student"
    $(document).on('click', '.student-listing-container .btn-success', function() {
    	$studentListingContainer.fadeOut(500, function() {
    		$studentFormContainer.fadeIn(500);
    	});
    	for (iterator = MIN; iterator < MAX; iterator++) {
    		$('.student-form-container .student-age').append($('<option>').html(iterator));
    	}
    });
   //---add course---

   $(document).on('click', 'a.add-course', function() {
   		
        var $newDiv = $('<div>').addClass('form-group');
        var $divLabel = $('<label>').html('Course44');
        var $divInput = $('<input>').addClass('form-control student-course').
                                        attr("name", "courses[]");
        var $divAnchor = $('<a>').addClass('remove-course').html('Remove course');

   		// $('form .form-group:last').insertBefore($newDiv.
     //        append($divLabel, $divInput, $divAnchor));
       $($newDiv.append($divLabel, $divInput,
                    $divAnchor).insertBefore('form .form-group:last'));

   });
   //---add course---
   
   $('form').submit(function(event) {	
	   var listCourses = $('input.student-course');
       var arrayCourses = [];
       $.each(listCourses, function(index, course){
            arrayCourses.push(course.value);
       });
       console.log(arrayCourses);
		var new_student = {student:
			{
		        first_name: $('input.first-name').val(),
		        last_name: $('input.last-name').val(),
		        age: $('select.student-age').val(),
		        courses: arrayCourses,
		        at_university: $('input.student-at-university').is(':checked')
			}
		};

		$.post('https://spalah-js-students.herokuapp.com/students', new_student);

        event.preventDefault();

	});
   //END button "Add Student"

});


