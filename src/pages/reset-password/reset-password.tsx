import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectLoginUserError,
  selectLoginUserRequest,
  clearError,
  resetPassword
} from '../../services/slices/userSlice';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(selectLoginUserError);
  const isLoading = useSelector(selectLoginUserRequest);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLoading && !error && isSubmitted) {
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    }
  }, [isLoading, error, navigate, isSubmitted]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!password || !token) {
      return;
    }
    dispatch(clearError());
    dispatch(resetPassword({ password, token }));
    setIsSubmitted(true);
  };

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
