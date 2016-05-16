// Yout js code goes here
'use strict';
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
        $('.btn.btn-default').click(function() { alert($(this).parent().data('id')) });    
        }
        
    });

    
});
