import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import requestPasswordResetEmail from '@/api/auth/requestPasswordResetEmail';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { useStoreState } from 'easy-peasy';
import Field from '@/components/elements/Field';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import { keyframes } from 'styled-components';

interface Values {
    email: string;
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

const BackToLoginLink = styled(Link)`
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

const Description = styled.p`
    ${tw`mt-1 text-sm text-neutral-400`};
`;

const RecaptchaContainer = styled.div`
    ${tw`absolute bottom-0 left-0 z-0 pointer-events-none opacity-0`};
`;

const StyledField = styled(Field)`
    & > label {
        ${tw`text-gray-200 font-semibold`};
    }
    
    & > div > input {
        ${tw`bg-neutral-800 border-neutral-700 text-neutral-200 hover:border-indigo-500 focus:border-indigo-500 transition-all duration-300`};
    }
`;

export default () => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const handleSubmission = ({ email }: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });

            return;
        }

        requestPasswordResetEmail(email, token)
            .then((response) => {
                resetForm();
                addFlash({ type: 'success', title: 'Success', message: response });
            })
            .catch((error) => {
                console.error(error);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            })
            .then(() => {
                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
            });
    };

    return (
        <Formik
            onSubmit={handleSubmission}
            initialValues={{ email: '' }}
            validationSchema={object().shape({
                email: string()
                    .email('A valid email address must be provided to continue.')
                    .required('A valid email address must be provided to continue.'),
            })}
        >
            {({ isSubmitting, setSubmitting, submitForm }) => (
                <LoginFormContainer title={'Reset Password'} css={tw`w-full flex`}>
                    <Description>
                        Enter your account email address to receive instructions on resetting your password.
                    </Description>
                    <div css={tw`mt-6`}>
                        <StyledField
                            light
                            label={'Email Address'}
                            name={'email'}
                            type={'email'}
                        />
                    </div>
                    <div css={tw`mt-8`}>
                        <StyledButton 
                            type={'submit'} 
                            size={'xlarge'} 
                            disabled={isSubmitting} 
                            isLoading={isSubmitting}
                            css={tw`w-full`}
                        >
                            Send Reset Email
                        </StyledButton>
                    </div>
                    
                    <FormDivider>
                        <div css={tw`flex justify-center`}>
                            <DividerText>or</DividerText>
                        </div>
                    </FormDivider>
                    <div css={tw`text-center`}>
                        <BackToLoginLink to={'/auth/login'}>
                            Back to Login
                        </BackToLoginLink>
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
