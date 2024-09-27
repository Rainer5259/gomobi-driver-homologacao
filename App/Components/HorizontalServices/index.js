// Modules
import React, { useRef } from 'react';

// Themes
import images from '../../Themes/WhiteLabelTheme/Images';

// Styles
import {
    Container,
    TabsContainer,
    TabItem,
    Item,
    ServiceImage,
    ServiceName,
    ServicePrice,
    ImageContainer,
    ServiceTime
} from './styles';

export default function HorizontalServices({
    services,
    onPressSelectService,
    onPressServiceDetails
}) {
    const scrollRef = useRef();

    const onPressTouch = (index, item) => {
        onPressSelectService(index, item);
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    return (
        <Container>
            <TabsContainer ref={scrollRef}>
                {
                    services.map((item, index) => (
                        <Item
                            key={index}
                            onPress={
                                !item.is_clicked
                                    ? () => onPressTouch(index, item)
                                    : () => onPressServiceDetails(item)
                              }
                        >
                            <TabItem
                                isClicked={item.is_clicked} index={index}
                            >
                                <ImageContainer>
                                    <ServiceImage
                                        source={
											item.icon && item.icon !== ''
												? { uri: item.icon }
												: images.car_icon
                                        }
                                    />
                                </ImageContainer>
                                <ServiceName>{ item.name }</ServiceName>
                                <ServicePrice>{ item.estimated_price }</ServicePrice>
                                <ServiceTime>{ item.time }</ServiceTime>
                            </TabItem>
                        </Item>

                    ))
                }
            </TabsContainer>
        </Container>
    );
}
