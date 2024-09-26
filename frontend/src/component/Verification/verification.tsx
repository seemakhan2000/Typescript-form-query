import React, { useState } from "react";

interface VerificationProps {
  phone: string;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

const Verification: React.FC<VerificationProps> = ({
  phone,
  onClose,
  onSuccess,
}) => {
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length === 6) {
      onSuccess(code);
    } else {
      alert("Please enter a valid 6-digit verification code.");
    }
  };

  return (
    <div className="modal show" style={{ display: "block" }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="Verification">
            <h3 className="h3">Verify Your Account</h3>
            <div className="Verification-body">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="number"
                  className="code"
                  placeholder="0"
                  min="0"
                  max="9"
                  value={verificationCode[index]}
                  onChange={(e) => handleChange(index, e)}
                />
              ))}
            </div>
            {<p className="text-danger"></p>}
            <button
              type="button"
              className="btn btn-primary verify"
              onClick={handleVerify}
            >
              Verify
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;



