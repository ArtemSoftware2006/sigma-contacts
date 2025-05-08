import { useState } from 'react';
import { AuthService } from '../service/authService';
import { useNavigate } from 'react-router-dom';
import { info } from '../utils/logger'
import { useUserStore } from './UserStore';
import { UserService } from '../service/userService';
import { UserUpdate } from '../types/user';

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (nickname: string, password: string) => {
    try {
      setLoading(true);
      const { token, user } = await AuthService.login({ nickname, password });
      localStorage.setItem('token', token);
      const userInfo : UserUpdate = await UserService.getMe()
      
      info(userInfo)
      localStorage.setItem('user', JSON.stringify(userInfo));      
      info(localStorage.getItem("user"))

      navigate('/');
    } catch (err) {
      const error = err as Error; 
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (nickname: string, password: string) => {
    try {
      setLoading(true);
      const { token, user } = await AuthService.register({ nickname, password });
      //TODO: вернуть из бека токен при регистрации!!!
      info(token, user)

      logout()
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    //TODO: реализовать на беке
    //AuthService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return { login, register, logout, error, loading };
};