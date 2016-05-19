// Yout js code goes here
'use strict';
var MIN = 16;
var MAX = 55;
var iterator;
$(function() {
    var $studentListingContainer = $('.student-listing-container').parent();
    var $studentDataContainer = $('.student-data-container').parent();
    var $studentFormContainer = $('.student-form-container').parent();
    var $studentTableBody = $('tbody');
    $studentDataContainer.hide();
    $studentFormContainer.hide();
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
    // button show
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
	});
    //START button "Add Student"
    // $('.student-listing-container .btn-success').html('3222');
    $(document).on('click', '.student-listing-container .btn-success', function() {
    	$studentListingContainer.fadeOut(500, function() {
    		$studentFormContainer.fadeIn(500);
    	});
    	// $('.student-form-container .student-age option').html('jjjjj');
    	for (iterator = MIN; iterator < MAX; iterator++) {
    		$('.student-form-container .student-age').append($('<option>').html(iterator));
    	}


    }); //END button "Add Student"
   


});


