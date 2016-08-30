/*! ValidInput v0.1.0 - https://github.com/defvayne23/ValidInput */
(function() {
  'use strict';

  var forms = document.querySelectorAll('form');

  Array.prototype.forEach.call(forms, function(form) {
    var form_submitted,
        form_submit,
        form_submits = form.querySelectorAll('.submit button');

    // Check for data attribute to skip validation.
    if(!form.hasAttribute('data-validation-ignore')) {
      // Add click event that sets the form_submit of this form
      form.addEventListener('click', function(e) {
        if(e.target.nodeName === 'BUTTON' || (e.target.nodeName === 'INPUT' && (e.target.getAttribute('type') === 'submit' || e.target.getAttribute('type') === 'image'))) {
          form_submitted = this;
          form_submit = e.target;
        }
      });

      form.addEventListener('submit', function(e) {
        var form_error = false,
            required_fields = form.querySelectorAll('[data-required]'),
            submit_value = '';

        // This is set from another event that may not fire first
        if(form_submit) {
          // If last submit click is this form.
          if(form_submitted === this) {
            submit_value = form_submit.value;

            // Check for data attribute to skip validation.
            if(form_submit.hasAttribute('data-validation-ignore')) {
              return true;
            }
          }
        }

        if(submit_value !== 'Back') {
          Array.prototype.forEach.call(required_fields, function(field) {
            var skip = false;

            if(field.nodeName === 'INPUT' || field.nodeName === 'TEXTAREA') {
              // Check if we should skip this input because it requires
              // another input to have a value or a specific value
              if(field.hasAttribute('data-requires')) {
                var field_requires = form.querySelector('[name="'+field.getAttribute('data-requires')+'"]:checked');

                if(!field_requires) {
                  field_requires = form.querySelector('[name="'+field.getAttribute('data-requires')+'"]');
                }

                if(field_requires) {
                  if(field.hasAttribute('data-requires-value')) {
                    // If value is not what we expect, skip validation
                    if(field_requires.value !== field.getAttribute('data-requires-value')) {
                      skip = true;
                    }
                  } else if(field_requires.value === '') {
                    skip = true;
                  }
                }
              }

              if(skip === false) {
                // Run validation on input
                var field_error = input_check(form, field);

                if(field_error === true) {
                  form_error = true;
                }

                field.addEventListener('blur', function(e) {
                  var field_error = input_check(form, this);

                  if(field_error === true) {
                    form_error = true;
                  }
                });
              }
            } else if(field.nodeName === 'SELECT') {
              // Check if we should skip this input because it requires
              // another input to have a value or a specific value
              if(field.hasAttribute('data-requires')) {
                var field_requires = form.querySelector('[name="'+field.getAttribute('data-requires')+'"]:checked');

                if(!field_requires) {
                  field_requires = form.querySelector('[name="'+field.getAttribute('data-requires')+'"]');
                }

                if(field_requires) {
                  if(field.hasAttribute('data-requires-value')) {
                    // If value is not what we expect, skip validation
                    if(field_requires.value !== field.getAttribute('data-requires-value')) {
                      skip = true;
                    }
                  } else if(field_requires.value === '') {
                    skip = true;
                  }
                }
              }

              if(skip === false) {
                if(field.value === '') {
                  form_error = true;
                  if(field.getAttribute('data-required-label')) {
                    form.querySelector('.'+field.getAttribute('data-required-label')).classList.remove('hide');
                  } else {
                    field.parentNode.classList.add('required-error');
                  }
                } else {
                  if(field.getAttribute('data-required-label')) {
                    form.querySelector('.'+field.getAttribute('data-required-label')).classList.add('hide');
                  } else {
                    field.parentNode.classList.remove('required-error');
                  }
                }

                field.addEventListener('change', function(e) {
                  if(this.value === '') {
                    form_error = true;
                    if(this.getAttribute('data-required-label')) {
                      form.querySelector('.'+this.getAttribute('data-required-label')).classList.remove('hide');
                    } else {
                      this.parentNode.classList.add('required-error');
                    }
                  } else {
                    if(this.getAttribute('data-required-label')) {
                      form.querySelector('.'+this.getAttribute('data-required-label')).classList.add('hide');
                    } else {
                      this.parentNode.classList.remove('required-error');
                    }
                  }
                });
              }
            } else if(field.classList.contains('required-sum')) {
              var ranges = field.querySelectorAll('input[type=range]'),
                  field_total = 0;

              Array.prototype.forEach.call(ranges, function(range) {
                field_total += parseInt(range.value);
              });

              if(field_total !== 100) {
                form_error = true;
                form.querySelector('.'+field.getAttribute('data-required-label')).classList.remove('hide');
              } else {
                form.querySelector('.'+field.getAttribute('data-required-label')).classList.add('hide');
              }
            } else if(field.classList.contains('radios') || field.nodeName === 'UL' || field.classList.contains('required-radios')) {
              var skip = false;

              if(field.hasAttribute('data-required-visible')) {
                if(field.offsetWidth > 0 && field.offsetHeight > 0) {
                  // is visible
                } else {
                  skip = true;
                }
              }

              if(skip === false) {
                var field_checked_inputs = field.querySelectorAll('input:checked');

                if(field_checked_inputs.length === 0) {
                  form_error = true;
                  if(field.getAttribute('data-required-label')) {
                    form.querySelector('.'+field.getAttribute('data-required-label')).classList.remove('hide');
                  } else {
                    field.previousElementSibling.classList.add('required-error');
                  }
                } else {
                  if(field.getAttribute('data-required-label')) {
                    form.querySelector('.'+field.getAttribute('data-required-label')).classList.add('hide');
                  } else {
                    field.previousElementSibling.classList.remove('required-error');
                  }
                }
              }
            }
          });

          // Reset form submit
          form_submitted = form_submit = null;

          if(form_error === false) {
            // e.preventDefault();
            // return false;
            return true;
          } else {
            e.preventDefault();
            return false;
          }
        }
      });
    }
  });

  function input_check(form, input) {
    var input_error = false;

    // Check value
    if(input.value === '') {
      input_error = true;
    }

    // Check if telephone numbers are 10 digits with any formatting
    if(input.getAttribute('type') === 'tel') {
      var tel = input.value;

      // Strip all non numeric characters
      tel = tel.replace(/\D/g,'');

      if(tel.length === 10) {
        // Do nothing
      } else {
        input_error = true;
      }
    }

    if(input_error === true) {
      if(input.getAttribute('data-required-label')) {
        form.querySelector('.'+input.getAttribute('data-required-label')).classList.remove('hide');
      } else {
        input.classList.add('required-error');
      }

      if(input.hasAttribute('id')) {
        var input_label = form.querySelector('label[for='+input.getAttribute('id')+']');
        if(input_label) {
          input_label.classList.add('required-error');
        }
      }
    } else {
      if(input.getAttribute('data-required-label')) {
        form.querySelector('.'+input.getAttribute('data-required-label')).classList.add('hide');
      } else {
        input.classList.remove('required-error');
      }

      if(input.hasAttribute('id')) {
        var input_label = form.querySelector('label[for='+input.getAttribute('id')+']');
        if(input_label) {
          input_label.classList.remove('required-error');
        }
      }
    }

    return input_error;
  }
}());
