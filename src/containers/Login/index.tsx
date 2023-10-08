import React from 'react'
import "./style.css"
import ButtonComponent from '../../components/ButtonComponent';

function Request(name: string, email: string, setAutenticated: React.Dispatch<React.SetStateAction<boolean>>) {
    const data = JSON.stringify({
        "name": name,
        "email": email
      });
      
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
          setAutenticated(true);
        }
      });
      
      xhr.open("POST", "https://frontend-take-home-service.fetch.com/auth/login");
    //   xhr.setRequestHeader("cookie", "AWSALB=ZBbL8G7tEt3KwlovIJhv4o6Py65VtQyf57i6AMvsUKBPTNSJXYjbjjt5yufISFS%2Fnm1JaEav%2FPDE0oVc9TTaiK2Qd0erT44JfSDC5gzEA0V8AH1MJnsE2ql5PXN5; AWSALBCORS=ZBbL8G7tEt3KwlovIJhv4o6Py65VtQyf57i6AMvsUKBPTNSJXYjbjjt5yufISFS%2Fnm1JaEav%2FPDE0oVc9TTaiK2Qd0erT44JfSDC5gzEA0V8AH1MJnsE2ql5PXN5; fetch-access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibHVpcyIsImVtYWlsIjoibHVpc0Bob3RtYWlsLmNvbSIsImlhdCI6MTY5NjIyMjc5MSwiZXhwIjoxNjk2MjI2MzkxfQ.ikYZqwvbV5GNLSjv3v74sxwgvbyYkLK9s9KUgm5v8Ck");
      xhr.setRequestHeader("Content-Type", "application/json");
      
      xhr.send(data);
}

interface LoginScreenProps{
  setAutenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
  const {
    setAutenticated
  } = props

  const [name, setName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value)
  }
  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
  }

  const handleClick = () => {
      console.log(`Nombre: ${name}, Email: ${email}`)
      Request(name, email, setAutenticated);
  }

  return (
    <div className='LoginScreen col-4 col-s-4'>
      <div className='LoginScreen_Header t-1'>Transform your life into love! ❤️🐶</div>
      <div className='LoginScreen_Subheader t-2'>Please introduce your name and email to start searching for your next friend 🐕</div>
      <input onChange={handleChangeName} type="text" name="name" id="" placeholder='name' className='LoginScreen_Input t-3' />
      <input onChange={handleChangeEmail} type="email" name="email" id="" placeholder='email' className='LoginScreen_Input t-3' />
      <ButtonComponent text='Sign in' handleClick={handleClick} />
    </div>
  )
}

export default LoginScreen