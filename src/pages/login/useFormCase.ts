import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { login } from '../../services/requests';
import { LoginResponse } from '../../interfaces/login';

const useFormCase = () => {
  const [loading, setLoading] = useState(false);

  const { errorMessages, register, handleSubmit } = useForm({
    initialState: {
      email: '',
      password: ''
    },
    validations: {
      email: name => {
        if (!name.trim()) return 'O email de usuário é obrigatório';
        const regex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!regex.test(name)) return 'Insira um e-mail válido';
      },
      password: password => {
        if (!password.trim()) return 'A senha é obrigatória';
      }
    }
  });

  const handleSubmitForm = handleSubmit(async data => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const { options, url } = login(formData);
    setLoading(true);
    try {
      const result = await fetch(url, options);
      const data: LoginResponse = await result.json();

      if (data.Ok) {
        window.location.href = '/profile';
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    errorMessages,
    register,
    handleSubmit: handleSubmitForm
  };
};

export default useFormCase;