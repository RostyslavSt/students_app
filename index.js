// Yout js code goes here
// using require branch
'use strict';

requirejs.config({
    baseUrl: './',
    paths: {
        jquery: 'js/jquery.min',
        jqueryUI: 'js/jquery-ui.min',
        lodash: 'js/lodash',
        mustache: 'js/mustache.min'
    }
});
requirejs(['jquery', 'lodash', 'mustache',
                    './views/studentView.js', './models/student.js', 'jqueryUI'],
                    function($, _, Mustache, studentViews, studentModel) {

  var MIN = 1;
  var MAX = 99;
  var iterator;
  var courseNumber;

  $(function() {
      var $studentListingContainer = $('.student-listing-container').parent();
      var $studentDataContainer = $('.student-data-container').parent();
      var $studentFormContainer = $('.student-form-container').parent();
      var $studentTableBody = $('tbody');
      $studentDataContainer.hide();
      $studentFormContainer.hide();
      $('.student-listing-container div.alert-success').hide();
     
      function showErrorsFromServer(errors) {
        $('div.alert-danger li.list-group-item').remove();
        $('.alert-danger').fadeIn(1500);
        $.each(errors, function(index, error) {
            var $error_li = $('<li>').addClass('list-group-item').html(error);
            $('ul').append($error_li);
        });
      }
      function renumberCourses() {
      	var quantityCourses = $('.remove-course').parent().find('label').length;
      	var courseNumber = 1;
      	$.each($('.remove-course').parent().find('label'), function(index, course) {
      		$(this).html('Course ' + (index + 1));
        	});
      }

      function clearFormStudent() {
          // $('label').val();
          // $('form').removeData('id');
          $('div.alert-danger li.list-group-item').remove();
          $('div.student-form-container input').val('');
          $('input.student-at-university').removeAttr('checked');
          $('input.student-at-university').prop( "checked", false);
          $('select.student-age').empty();
          $('select.student-age').append($('<option>').html('Select age'));
          $('.student-form-container .remove-course').parent().remove();
      	var courseNumber = 1;
      	for (var i = 1; i <= 2; i++) {
  	    	var $newDiv = $('<div>').addClass('form-group');
  		    var $divLabel = $('<label>').html('Course ' + i);
  		    var $divInput = $('<input>').addClass('form-control student-course').
  		                                        attr("name", "courses[]");
  		        var $divAnchor = $('<a>').addClass('remove-course').attr('href', '#').
  		        							html('Remove course');
  		       $($newDiv.append($divLabel, $divInput,
  		                    $divAnchor).insertBefore('form .form-group:last'));
  		       courseNumber++;
  	    	$studentListingContainer.fadeOut(500, function() {
  	    		$studentFormContainer.fadeIn(500);
  	    	});
      	}
          
      }
      function back() {
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
      function downloadCourses(course, index) {
      		var courseNumber = 1;
      		var $newDiv = $('<div>').addClass('form-group');
  	        var $divLabel = $('<label>').html('Course ' + (index + 1));
  	        var $divInput = $('<input>').addClass('form-control student-course').
  	                                        attr("name", "courses[]").
  	                                        	val(course);
  	        var $divAnchor = $('<a>').addClass('remove-course').attr('href', '#').
  	        							html('Remove course');
  	       $($newDiv.append($divLabel, $divInput,
  	                    $divAnchor).insertBefore('form .form-group:last'));
  	       courseNumber++;
      	}
      function getFromServer(studentId) {
          $('div.alert-danger').hide();
      	$('input.student-course').parent().remove(); //remove field courses to create once more
      	$.get({
      		url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
      		contentType: 'application/json',
      		dataType: 'json',
      		success: function(student) {
            $('form').data('id', student.data.id);
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
      				$('input.student-at-university').attr('checked', 'checked');
              $('input.student-at-university').prop('checked', true);
      			} 
      			$.each(student.data.courses, function(index, course){
      				downloadCourses(course, index);
      			});
      		}
      	});
      }
      function createCourses(student) {
          $('.student-data-group').has('.course-group').empty();
          if (student.data.courses.length > 0) {
            $.each(student.data.courses, function (index, course) {
              var objForMustache = {ind: index, cour: course};
              objForMustache.ind = index + 1;
              objForMustache.cour = course;
              var $newCourse = Mustache.render(studentViews.newCourse, objForMustache);
              $('div.student-data-group:last').append($newCourse);

              // $('div.student-data-group:last').append($('<div>').addClass('course-group').
              // append($('<b>').html('Course  ' + (index + 1) + ': ')).
              // append($('<span>').html(course)));
            });
          } 
      }
      function studentRowView(student) {
       return Mustache.render(studentViews.rowView, student);
      }
      function createStudentsListing(students) {
      	$.each(students.data, function(index, student) {
                  $studentTableBody.append(studentRowView(student));
              });
      }
      function requestToServerForStudentData(studentId) {
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
      }
      
      //< show studentListing
    $studentTableBody.empty();
    var studentSequence = JSON.parse(localStorage.getItem('studentSequence'));
    // < sortable
    $.get({
            url: 'https://spalah-js-students.herokuapp.com/students',
            contentType: "application/json",
            dataType: 'json',
            success: function(students) {
               $.each(studentSequence, function(index, id) {
                          $.each(students.data, function(index, student) {
                              if (student.id === id) $studentTableBody.append(studentRowView(student));
                          });
                      });
            }
    });
     // sortable >
    $studentTableBody.sortable({
      deactivate: function(event, ui) {
          var studentSequence = []
          $.each($('tbody tr td:last-child'), function(index, td) {
              studentSequence.push($(td).data('id'));
          });
          localStorage.setItem('studentSequence', JSON.stringify(studentSequence));
      }
    });
    //show studentListing >
    
  	//< button EDIT on list student
  	$(document).on('click', '.student-listing-container .btn-primary', function() {
  		var studentId = $(this).parent().data('id');
  		$('form').data('id', studentId);
  		clearFormStudent();
  		$studentListingContainer.fadeOut(500, function() {
  	    $studentFormContainer.fadeIn();
      	});
  		getFromServer(studentId);
      });
      // button EDIT on list student >

       // < button "EDIT" on studentData
  	$(document).on('click', '.student-data-container a.btn-primary', function() {
  		clearFormStudent();
  		$studentDataContainer.fadeOut(500, function() {
  	    $studentFormContainer.fadeIn();
      	});
      	var studentId = $(this).parent().data('id');
        getFromServer(studentId);
     	});
  	// button "EDIT" on studentData >

      // < button Delete
      $(document).on('click', '.student-listing-container .btn-danger', function() {
      	var studentId = $(this).parent().data('id');
      	var confirmDelete = confirm('Are you sure to delee this student?');
      	$('.student-listing-container div.alert-success').hide();
          var $tempId = $(this).parent().parent();
          if (confirmDelete) {
          	        	    	
  	        $.ajax({
  	            url: 'https://spalah-js-students.herokuapp.com/students/' + studentId,
  	            contentType: "application/json",
  	            dataType: 'json',
  	            type: 'DELETE',
  	            success: function() {
                      $('.student-listing-container div.alert-success').html('Student succesfully deleted');
  	            	$tempId.fadeOut(1000, function() {
                          $('.student-listing-container div.alert-success').fadeIn(1000);
                      });
                  } 
  	        });
  	    }
  	    // event.preventDefault();
      }); // button delete >

         // < BUTTON SHOW (studentDataContainer)
      $(document).on('click', '.student-listing-container .btn-default', function() {
      	$studentListingContainer.fadeOut(500, function() {
      		$studentDataContainer.fadeIn(500);
      	});
      	$('div.alert-success').hide(); // hide div
        $('div.student-data-container').removeData('id');
      	var studentId = $(this).parent().data('id');
      	// $('div.student-data-container').data('id', 0);
      	$('div.student-data-container').data('id', studentId);
      	$('div.student-data-group span').empty();
      	// console.log(studentId);
        requestToServerForStudentData(studentId);
      	
  	});//END BUTTON SHOW >
  	    
      // < button BACK for SHOW---
    	$(document).on('click', 'div.student-data-container a.btn-default', function() {
    		$studentTableBody.empty();
    		$studentDataContainer.fadeOut(500, function() {
    			$studentListingContainer.fadeIn(500);
    		});
    		back();
        $('form').removeData('id')
    	});
  	// ----button BACK for SHOW >

      // < "Add Student"
      $(document).on('click', '.student-listing-container .btn-success', function() {
      	clearFormStudent();
      	$('div.alert-danger').hide();
      	for (iterator = MIN; iterator < MAX; iterator++) {
      		$('.student-form-container .student-age').append($('<option>').html(iterator));
      	} //create a list of age
      	//  "Add Student" >
      	
      });

     		//  < push SUBMIT	   
     $('form').submit(function(event) {
         var student = 'students';
         var listCourses = $('input.student-course');
         var currentId = $('form').data('id');
         var arrayCourses = [];
         $.each(listCourses, function(index, course) {
              arrayCourses.push(course.value);
         });
         var newStudent = {student:
  			{
  		        first_name: $('input.first-name').val(),
  		        last_name: $('input.last-name').val(),
  		        age: $('select.student-age').val(),
  		        courses: arrayCourses,
  		        at_university: $('input.student-at-university').is(':checked')
  			}
  		};
  		
  		if (currentId) {
          	student = 'students/' + currentId;
          	$.ajax({
    			    url: 'https://spalah-js-students.herokuapp.com/'+ student,
    			    type: 'PUT',
    			    data: newStudent,
              // contentType: 'application/json',
    			    success: function(data) {
    	                if (data.errors) {
    	                    showErrorsFromServer(data.errors);
                      } else {
                          $studentFormContainer.fadeOut(500, function() {
                            $studentDataContainer.fadeIn(500);
                          });
                          $('.student-data-container div.alert-success').fadeIn(500);

                          $('div.student-data-group span').empty();
                          requestToServerForStudentData(currentId);
                        }
    	              }
  			     });
          } else {
        			$.post('https://spalah-js-students.herokuapp.com/'+ student, 
        				newStudent,
        				function(data) {
        					if (data.errors) {
                    showErrorsFromServer(data.errors);
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
                					            createStudentsListing(students);
        					                 }
        				    	         });
        	                 }
        	        }
              );
        	  }
  	  $('form').removeData('id'); // clear form id
  	  event.preventDefault();
  	});
     // push push SUBMIT >

     // < add course---
     $(document).on('click', 'a.add-course', function() {
     		 var $addNewCourse = Mustache.render(studentViews.addCourse);
         // $('form .form-group:last').append($addNewCourse);
         $($addNewCourse).insertBefore('form .form-group:last');
         renumberCourses();
         event.preventDefault();
     });
    		 //---add course >
     
     		// < remove course---
     $(document).on('click','form .remove-course', function() {
     	$(this).parent().fadeOut(500, function () {
        $(this).remove();
        renumberCourses();
      });
     	 
     	event.preventDefault();
     });
    		//---remove course >

    		// <----button BACK on FormContainer---
    	$(document).on('click', 'a.btn-default:last', function() {
    		$studentFormContainer.fadeOut(500, function() {
    			$studentListingContainer.fadeIn(500);
    		});
    		back();
        $('form').removeData('id')
  	});
    		// ----button BACK on FormContainer--->
  });
});

