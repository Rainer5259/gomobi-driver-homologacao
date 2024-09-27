// Modules
import styled, {css} from 'styled-components/native';

export const Container = styled.View`
    background: #FFF;
    padding-top: 10px;
`;

export const TabsContainer = styled.ScrollView.attrs({
    horizontal: true,
    contentContainerStyle: { paddingLeft: 10, paddingRight: 20 },
    showsHorizontalScrollIndicator: false,
})``;

export const TabItem = styled.View`
    ${props => {
        return (props.isClicked
            ? css`
                margin-top: 5px;
                margin-bottom: 5px;
                height: 150px;
                width: 120px;
                background: #FFF;
                border-radius: 3px;
                margin-left: 10px;
                padding: 10px;
                justify-content: space-between;

                elevation: 3;
                border-radius: 5px;
                `
            : css`
                margin-top: 5px;
                margin-bottom: 5px;
                height: 150px;
                width: 120px;
                background: #FFF;
                border-radius: 3px;
                margin-left: 10px;
                padding: 10px;
                justify-content: space-between;
            `
        )
    }}
`;

export const Item = styled.TouchableWithoutFeedback``;

export const ServiceName = styled.Text`
    font-size: 13px;
    text-align: center;
    color: #000;
`;

export const ServiceTime = styled.Text`
    font-size: 11px;
    text-align: center;
    color: #000;
`;

export const ServicePrice = styled.Text`
    font-size: 17px;
    font-weight: bold;
    text-align: center;
    color: #000;
`;

export const ServiceImage = styled.Image`
    height: 65px;
    width: 65px;
`;

export const ImageContainer = styled.View`
    width: 100%;
    align-items: center;
`;
