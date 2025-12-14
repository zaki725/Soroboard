'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TextField } from '@/components/form';
import { Button, PageContainer, Title } from '@/components/ui';
import { useUser } from '@/contexts/UserContext';
import { useLogin } from './hooks/useLogin';
import type { LoginFormData } from './types/login-form';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useUser();
  const { handleSubmit: handleLoginSubmit, isLoading } = useLogin();

  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    await handleLoginSubmit(data, methods.setError);
  });

  // ログイン済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // ログイン済みの場合は何も表示しない
  if (user) {
    return null;
  }

  return (
    <PageContainer className="flex items-center justify-center">
      <div className="max-w-md w-full">
        <Title className="text-center">ログイン</Title>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <div className="space-y-4">
                <TextField
                  name="email"
                  label="メールアドレス"
                  type="email"
                  placeholder="example@example.com"
                  rules={{
                    required: 'メールアドレスは必須です',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: '有効なメールアドレスを入力してください',
                    },
                  }}
                />
                <TextField
                  name="password"
                  label="パスワード"
                  type="password"
                  placeholder="パスワードを入力"
                  rules={{
                    required: 'パスワードは必須です',
                  }}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  ログイン
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </PageContainer>
  );
}

