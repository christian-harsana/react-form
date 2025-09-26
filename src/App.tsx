import React, { useState } from 'react'
import Modal from './components/Modal.tsx'

const COLORS = ["Red", "Black", "Blue", "Yellow", "Pink", "White", "Green"];
const SPORTS = ["Basketball", "Soccer", "Rugby"];

type FormData = {
  name: string;
  email: string;
  password: string;
  color: string;
  sports: string[];
  soccerTeam: string;
}

type FormErrors = {
  [K in keyof FormData]?: string;
}

type FormTouched = {
  [K in keyof FormData]?: boolean;
}

function App() {

  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "", color: "", sports: [], soccerTeam: ""});
  const [fieldTouched, setFieldTouched] = useState<FormTouched>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  // --------------------------------------
  // HANDLERS
  // --------------------------------------

  function validateField(name: keyof FormData, value: string | string[]): string {
    
    switch(name) {

      case "name":
        if (value.length < 1) return "Please provide a name";
        break;

      case "email":
        if (value.length < 1) return "Please provide an email";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value as string)) return "Please input a valid email";
        break;

      case "password":
        if (value.length < 1) return "Please provide a password";
        if (value.length < 8) return "Password must be at least 8 characters";
        break;
      
      case "soccerTeam":
        if (value.length < 1) return "Please input a soccer team";
        break;
    }

    return "";
  }


  function validateForm(formData: FormData) {

    const submissionError:FormErrors = {};

    Object.keys(formData).forEach((name) => {

      const fieldName = name as keyof FormData;
      let error = "";

      if (fieldName === "soccerTeam" && !formData.sports.includes("Soccer")) {
        error = "";
      }
      else {
        error = validateField(fieldName, formData[fieldName]);
      }

      if (error) submissionError[fieldName] = error; 
    });

    return submissionError;
  }


  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

    const name = e.target.name as keyof FormData;
    let value: string | string[];

    // Reset the success state when user initiate change on form fields
    setSubmissionSuccess(false);

    // Get the value from the fields
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      value = Array.from(e.target.selectedOptions, option => option.value);
    }
    else
    {
      value = e.target.value;
    }

    // Store input value
    if (name === "sports" && !value.includes("Soccer")) {
      setFormData((prev) => ({...prev, [name]: value as string[], soccerTeam: "" }));
    }
    else
    {
      setFormData((prev) => ({...prev, [name]: value }));
    }

    // Validate and store validation result
    if (fieldTouched[name]) {
      setErrors((prev) => ({...prev, [name]: validateField(name, value)}));
    }
  }


  function handleFieldBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {

    const name = e.target.name as keyof FormData;
    let value: string | string[];

    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      value = Array.from(e.target.selectedOptions, option => option.value);
    }
    else
    {
      value = e.target.value;
    }

    setFieldTouched((prev) => ({...prev, [name]: true}));
    setErrors((prev) => ({...prev, [name]: validateField(name, value)}));
  }


  function handleFormSubmit(e: React.FormEvent, formData: FormData) {

    e.preventDefault();

    const submissionError = validateForm(formData);

    if (Object.keys(submissionError).length) {

      setFieldTouched({
        name: true, 
        email: true, 
        password: true, 
        color: true, 
        sports: true, 
        soccerTeam: true
      });
      setErrors(submissionError);
    }
    else
    {
      setSubmissionSuccess(true);
      setFieldTouched({});
      setErrors({});

      console.log("Process submitted form...");
    }
  }

  function handleSuccessModalClose() {

    setSubmissionSuccess(false);
    setFormData({
      name: "", 
      email: "", 
      password: "", 
      color: "", 
      sports: [], 
      soccerTeam: ""
    })
  }


  // --------------------------------------
  // RENDER
  // --------------------------------------

  return (
    <>
      <div className="card">
        <h1 className="u-text-align-center">React Form</h1>

        <form onSubmit={(e) => handleFormSubmit(e, formData)}>
          <div className="l-v-spacing-lv-3">
            <label htmlFor="name" className="required-field" title="Name - Required">Name</label>
            <input id="name" 
              name="name" 
              type="text"
              required={true} 
              value={formData.name} 
              onChange={(e) => handleFieldChange(e)}
              onBlur={(e) => handleFieldBlur(e)}
              className={errors.name ? "s-error" : "" }
              {...(errors.name && { "aria-invalid" : "true", "aria-describedby" : "nameError" })} />
            {errors.name && <div id="nameError" className="field-error">{errors.name}</div>}
          </div>

          <div className="l-v-spacing-lv-3">
            <label htmlFor="email" className="required-field" title="Email - Required">Email</label>
            <input id="email" 
              name="email" 
              type="email" 
              required={true} 
              value={formData.email} 
              onChange={(e) => handleFieldChange(e)} 
              onBlur={(e) => handleFieldBlur(e)}
              className={errors.email ? "s-error" : "" }
              {...(errors.email && { "aria-invalid" : "true", "aria-describedby" : "emailError" })} />
            {errors.email && <div id="emailError" className="field-error">{errors.email}</div>}
          </div>

          <div className="l-v-spacing-lv-3">
            <label htmlFor="password" className="required-field" title="Password - Required">Password</label>
            <input id="password" 
              name="password" 
              type="password" 
              required={true} 
              value={formData.password}
              onChange={(e) => handleFieldChange(e)} 
              onBlur={(e) => handleFieldBlur(e)}
              className={errors.password ? "s-error" : "" }
              minLength={8} 
              {...(errors.password && { "aria-invalid" : "true", "aria-describedby" : "passwordError" })} />
            {errors.password && <div id="passwordError" className="field-error">{errors.password}</div>}
          </div>

          <div className="l-v-spacing-lv-3">
            <label htmlFor="color">Color</label>
            <select id="color" name="color" value={formData.color} onChange={(e) => handleFieldChange(e)}>
              <option key="0" value="">Please select</option>
              {
                COLORS.map((color) => <option key={color} value={color}>{color}</option>)
              }
            </select>
          </div>

          <div className="l-v-spacing-lv-3">
            <label htmlFor="sports">Sport</label>
            <select id="sports" name="sports" size={3} multiple={true} value={formData.sports} onChange={(e) => handleFieldChange(e)}>
              {
                SPORTS.map((sport) => <option key={sport} value={sport}>{sport}</option>)
              }
            </select>
          </div>
          
          {
            formData.sports.includes("Soccer") && 
              <div className="l-v-spacing-lv-3" aria-live="polite">
                <label htmlFor="soccer-team" className="required-field" title="Favourite Soccer Team - Required">Favourite Soccer Team</label>
                <input id="soccer-team" 
                  name="soccerTeam" 
                  type="text" 
                  required={true} 
                  value={formData.soccerTeam} 
                  onChange={(e) => handleFieldChange(e)} 
                  onBlur={(e) => handleFieldBlur(e)}
                  className={errors.soccerTeam ? "s-error" : "" }
                  {...(errors.soccerTeam && { "aria-invalid" : "true", "aria-describedby" : "soccerTeamError" })} />
                {errors.soccerTeam && <div id="soccerTeamError" className="field-error">{errors.soccerTeam}</div>}
              </div>
          }

          <div className="l-v-spacing-lv-3">
            <button type="submit" className="btn-primary btn-full">Submit</button>
          </div>
        </form>  
      </div>

      <Modal showModal={submissionSuccess} handleClose={handleSuccessModalClose}>
        <div className="u-text-align-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="50" height="50" fill="#2ecc71">
            {/* !Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. */}
            <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z"/>
          </svg>
          <p>Your submission is successfull.</p>
          <button type="button" className="btn-primary btn-full" onClick={handleSuccessModalClose}>Close</button>
        </div>
      </Modal>
    </>
  )
}

export default App