import styled from 'styled-components/macro';
import tw from 'twin.macro';

const Label = styled.label<{ isLight?: boolean }>`
    ${tw`block text-xs uppercase text-white font-bold mb-1 sm:mb-2`};
    ${(props) => props.isLight && tw`text-white`};
`;

export default Label;
