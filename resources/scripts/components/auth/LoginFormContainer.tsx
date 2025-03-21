import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import { keyframes } from 'styled-components';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

// Animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const Container = styled.div`
    animation: ${fadeIn} 0.6s ease-out;
    
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 700px;
    `};
`;

const LogoContainer = styled.div`
    ${tw`flex-none select-none mb-6 md:mb-0 self-center transition-transform duration-300 ease-in-out`};
    animation: ${float} 6s ease-in-out infinite;
    
    &:hover {
        transform: scale(1.05);
    }
`;

const FormBox = styled.div`
    ${tw`md:flex w-full bg-neutral-900 shadow-xl rounded-lg p-6 md:pl-0 mx-1 border border-neutral-800 transition-all duration-300`};
    background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
    
    &:hover {
        ${tw`shadow-2xl border-indigo-500`};
        transform: translateY(-5px);
    }
`;

const FormContent = styled.div`
    ${tw`flex-1 pl-6`};
`;

const FormTitle = styled.h2`
    ${tw`text-3xl text-center text-indigo-400 font-bold py-4 mb-4`};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const FooterText = styled.p`
    ${tw`text-center text-neutral-500 text-xs mt-4 transition-colors duration-300`};
    
    &:hover {
        ${tw`text-neutral-400`};
    }
`;

const FooterLink = styled.a`
    ${tw`no-underline text-indigo-400 hover:text-indigo-300 transition-colors duration-300`};
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

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        {title && <FormTitle>{title}</FormTitle>}
        <FlashMessageRender css={tw`mb-2 px-1`} />
        <Form {...props} ref={ref}>
            <FormBox>
                <LogoContainer>
                    <img 
                        src={'https://raw.githubusercontent.com/subhampro/gameserver-panel/refs/heads/main/public/assets/svgs/host.webp'} 
                        css={tw`block w-48 md:w-64 mx-auto`} 
                        alt="PROHostVPS Logo"
                    />
                </LogoContainer>
                <FormContent>{props.children}</FormContent>
            </FormBox>
        </Form>
        <FooterText>
            &copy; 2015 - {new Date().getFullYear()}&nbsp;
            <FooterLink
                rel={'noopener nofollow noreferrer'}
                href={'https://prohostvps.com/'}
                target={'_blank'}
            >
                PROHostVPS The Ultimate VPS Solution
            </FooterLink>
        </FooterText>
    </Container>
));
