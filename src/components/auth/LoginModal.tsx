"use client";

import { useEffect, useState } from "react";


import OtpVerificationModal from "../OtpVerificationModal";
import CreateAccountModal from "../CreateAccountPopup";
import LoginModal from "../LoginModal";
import CongratulationModal from "../CongrarulationModal";
import ForgotPasswordModal from "../ForgotPasswordModal/ForgotPasswordModal";


type AuthFlowProps = {
  loginOpen: boolean;
  setLoginOpen: (open: boolean) => void;
};

export default function AuthFlow({ loginOpen, setLoginOpen }: AuthFlowProps) {
const [isLogin, setIsLogin] = useState(loginOpen);

const [isOtp, setIsOtp] = useState(false);
const [isForgot, setIsForgot] = useState(false);
const [isLast, setIsLast] = useState(false);
const [createAccountModal, setCreateAccountModal] = useState(false);

const [phoneNumber] = useState("");
useEffect(() => {
  setIsLogin(loginOpen);
}, [loginOpen]);
return (
<>
{/* LOGIN */}


  <LoginModal
    open={isLogin}
    onClose={() => {setIsLogin(false); setLoginOpen(false);}}
   
   
  />

 

  <OtpVerificationModal
    open={isOtp}
    onClose={() => setIsOtp(false)}
    number={phoneNumber}
    setCreateAccountModal={() => {
      setIsOtp(false);
      setCreateAccountModal(true);
    }}
  />

  {/* CREATE ACCOUNT */}

  <CreateAccountModal
    open={createAccountModal}
    onClose={() => {setCreateAccountModal(false);       setIsLast(true);}}
  />

  {/* SUCCESS */}

  <CongratulationModal
    open={isLast}
    onClose={() => {
      setIsLast(false);
    }}
    setIsLogin={setIsLogin}
  />

  {/* FORGOT PASSWORD */}

  <ForgotPasswordModal
      open={isForgot}
      onClose={() => setIsForgot(false)}
      setIsLogin={setIsLogin}
      setIsLast={setIsLast}
  />
</>

);
}
