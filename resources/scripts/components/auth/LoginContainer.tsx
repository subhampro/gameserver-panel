import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import { keyframes } from 'styled-components';

interface Values {
    username: string;
    password: string;
}

const shine = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const ForgotPasswordLink = styled(Link)`
    ${tw`text-sm text-indigo-400 tracking-wide no-underline hover:text-indigo-300 transition-all duration-300`};
    position: relative;
    
    &:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 1px;
        bottom: -2px;
        left: 0;
        ${tw`bg-indigo-300`};
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
    }
    
    &:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
`;

const StyledButton = styled(Button)`
    ${tw`bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 transition-all duration-300`};
    box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.4);
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.6);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const InputContainer = styled.div`
    ${tw`mt-6 transition-all duration-300`};
    
    &:hover {
        transform: translateX(2px);
    }
`;

const FormDivider = styled.div`
    ${tw`my-6 relative`};
    
    &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        ${tw`bg-neutral-800`};
    }
`;

const DividerText = styled.span`
    ${tw`bg-neutral-900 text-neutral-500 px-2 relative z-10 text-sm`};
`;

const RecaptchaContainer = styled.div`
    ${tw`absolute bottom-0 left-0 z-0 pointer-events-none opacity-0`};
`;

const StyledField = styled(Field)`
    & > label {
        ${tw`text-white font-semibold`};
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    & > div > input {
        ${tw`bg-neutral-800 border-neutral-700 text-neutral-200 hover:border-indigo-500 focus:border-indigo-500 transition-all duration-300`};
    }
`;

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });

            return;
        }

        login({ ...values, recaptchaData: token })
            .then((response) => {
                if (response.complete) {
                    // @ts-expect-error this is valid
                    window.location = response.intended || '/';
                    return;
                }

                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <Formik
            onSubmit={onSubmit}
            initialValues={{ username: '', password: '' }}
            validationSchema={object().shape({
                username: string().required('A username or email must be provided.'),
                password: string().required('Please enter your account password.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={'Welcome Back'} css={tw`w-full flex`}>
                    <StyledField 
                        light 
                        type={'text'} 
                        label={'Username or Email'} 
                        name={'username'} 
                        disabled={isSubmitting}
                        css={tw`[&>label]:!text-white [&>label]:!font-bold`}
                    />
                    <InputContainer>
                        <StyledField 
                            light 
                            type={'password'} 
                            label={'Password'} 
                            name={'password'} 
                            disabled={isSubmitting}
                            css={tw`[&>label]:!text-white [&>label]:!font-bold`}
                        />
                    </InputContainer>
                    <div css={tw`mt-8`}>
                        <StyledButton 
                            type={'submit'} 
                            size={'xlarge'} 
                            isLoading={isSubmitting} 
                            disabled={isSubmitting}
                            css={tw`w-full`}
                        >
                            Sign In
                        </StyledButton>
                    </div>
                    
                    <FormDivider>
                        <div css={tw`flex justify-center`}>
                            <DividerText>or</DividerText>
                        </div>
                    </FormDivider>
                    <div css={tw`text-center`}>
                        <ForgotPasswordLink to={'/auth/password'}>
                            Forgot your password?
                        </ForgotPasswordLink>
                    </div>
                    
                    {recaptchaEnabled && (
                        <RecaptchaContainer>
                            <Reaptcha
                                ref={ref}
                                size={'invisible'}
                                sitekey={siteKey || '_invalid_key'}
                                onVerify={(response) => {
                                    setToken(response);
                                    submitForm();
                                }}
                                onExpire={() => {
                                    setSubmitting(false);
                                    setToken('');
                                }}
                            />
                        </RecaptchaContainer>
                    )}
                </LoginFormContainer>
            )}
        </Formik>
    );
};

export default LoginContainer;
