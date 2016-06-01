var STUDENT_ROW_VIEW = `
<tr>
  <td>{{first_name}}</td>
  <td>{{last_name}}</td>
  <td data-id={{id}}>
    <a href="#" class="btn btn-default">Show</a>
    <a href="#" class="btn btn-primary">Edit</a>
    <a href="#" class="btn btn-danger">Delete</a>
  </td>
</tr>
`;

var ADD_COURSE = `
<div class='form-group'>
	<label>Course 1:</label>
	<input name='courses[]' class='form-control student-course'>
	<a href='#' class='remove-course'>Remove course</a>
</div>
 `;

var	NEW_COURSE = `
<div class="course-group">
	<b>Course {{ind}} : </b>
	<span class='student-course'>{{cour}}</span>
</div>
`

define(function() {
    return {
        rowView: `
                                <tr>
                                  <td>{{first_name}}</td>
                                  <td>{{last_name}}</td>
                                  <td data-id={{id}}>
                                    <a href="#" class="btn btn-default">Show</a>
                                    <a href="#" class="btn btn-primary">Edit</a>
                                    <a href="#" class="btn btn-danger">Delete</a>
                                  </td>
                                </tr>
                            `
    };
});