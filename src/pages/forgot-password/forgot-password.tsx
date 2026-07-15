import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectLoginUserError,
  clearError,
  forgotPassword
} from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const error = useSelector(selectLoginUserError);

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [isSuccess, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(forgotPassword({ email }));
    setIsSuccess(true);
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
