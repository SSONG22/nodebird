import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import {
  Overlay,
  Global,
  Header,
  CloseBtn,
  SlickWrapper,
  Indicator,
  ImgWrapper,
} from "./styles";

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <Indicator>
          <div>
            {console.log(currentSlide)}
            {currentSlide + 1} /{images.length}
          </div>
        </Indicator>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img
                  src={`${v.src.replace(/\/thumb\//, "/original/")}`}
                  alt={v.src}
                />
              </ImgWrapper>
            ))}
          </Slick>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
