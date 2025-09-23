import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

  const COLORS = ["Red", "Black", "Blue", "Yellow", "Pink", "White", "Green"];
  const SPORTS = ["Basketball", "Soccer", "Rugby"];

  type FormData = {
    name: string;
    email: string;
    password: string;
    color: string;
    sports: string[];
    soccerTeam?: string;
  }

  type FormErrors = {
    [K in keyof FormData]?: string;
  }

  type FormTouched = {
    [K in keyof FormData]?: boolean;
  }

  const [formData, setFormData] = useState<FormData>({ name: "", email: "", password: "", color: "", sports: [], soccerTeam: ""});
  const [fieldTouched, setFieldTouched] = useState<FormTouched>({});
  const [errors, setErrors] = useState<FormErrors>({});
  

  // --------------------------------------
  // HANDLERS
  // --------------------------------------

  function validateField(name: string, value: string | string[]): string {
    
    let error = "";
    
    switch(name) {
      case "name":
        error = (value.length < 1) ? "Please input a name" : "";
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        error = (value && !emailRegex.test(value as string)) ? "Please input a valid email" : "";
        break;

      case "password":
        error = (value && value.length < 8) ? "Password must be at least 8 characters" : "";
        break;
      
      case "soccerTeam":
        error = (value.length < 1) ? "Please input a soccer team" : "";
        break;
    }

    return error;
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

    const name = e.target.name as keyof FormData;
    let value: string | string[];

    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      value = Array.from(e.target.selectedOptions, option => option.value);
    }
    else
    {
      value = e.target.value;
    }

    setFormData((prev) => ({...prev, [name]: value }));

    if (fieldTouched[name]) {
      setErrors((prev) => ({...prev, [name]: validateField(name, value)}));
    }
  }


  function handleFieldBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {

    const { name } = e.target;
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


  function handleFormSubmit() {

    alert(`Form submitted ... ${JSON.stringify(formData)}`);
  }

  // --------------------------------------
  // RENDER
  // --------------------------------------

  console.log("render");

  return (
    <>
      <h1 className="u-text-align-center">React Form</h1>

      <form onSubmit={handleFormSubmit}>
        <div className="l-v-spacing-lv-3">
          <label htmlFor="name">Name</label>
          <input id="name" 
            name="name" 
            type="text" 
            required={true} 
            value={formData.name} 
            onChange={(e) => handleFieldChange(e)}
            onBlur={(e) => handleFieldBlur(e)}
            {...(errors.name && { "aria-invalid" : "true", "aria-describedby" : "nameError" })} />
          {errors.name && <div id="nameError" className="field-error">{errors.name}</div>}
        </div>

        <div className="l-v-spacing-lv-3">
          <label htmlFor="email">Email</label>
          <input id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => handleFieldChange(e)} 
            onBlur={(e) => handleFieldBlur(e)}
            {...(errors.email && { "aria-invalid" : "true", "aria-describedby" : "emailError" })} />
          {errors.email && <div id="emailError" className="field-error">{errors.email}</div>}
        </div>

        <div className="l-v-spacing-lv-3">
          <label htmlFor="password">Password</label>
          <input id="password" 
            name="password" 
            type="password" 
            value={formData.password} 
            onChange={(e) => handleFieldChange(e)} 
            onBlur={(e) => handleFieldBlur(e)}
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
          <select id="sports" name="sports" className="multiple" multiple={true} value={formData.sports} onChange={(e) => handleFieldChange(e)}>
            {
              SPORTS.map((sport) => <option key={sport} value={sport}>{sport}</option>)
            }
          </select>
        </div>
        
        {
          formData.sports.includes("Soccer") && 
            <div className="l-v-spacing-lv-3" aria-live="polite">
              <label htmlFor="soccer-team">Favourite Soccer Team</label>
              <input id="soccer-team" 
                name="soccerTeam" 
                type="text" 
                required={true} 
                value={formData.soccerTeam} 
                onChange={(e) => handleFieldChange(e)} 
                onBlur={(e) => handleFieldBlur(e)}
                {...(errors.soccerTeam && { "aria-invalid" : "true", "aria-describedby" : "soccerTeamError" })} />
              {errors.soccerTeam && <div id="soccerTeamError" className="field-error">{errors.soccerTeam}</div>}
            </div>
        }

        <div className="l-v-spacing-lv-3">
          <button type="submit" className="btn-primary btn-full">Submit</button>
        </div>
      </form>
    </>
  )
}

export default App