import React, { useState } from "react";
import { OfferHeader, OfferType } from "../../../components/Offer/OfferHeader";
import styles from "./index.module.css";
import {
  Offer_Types,
  OffersWork,
  boostYourBusinessContent,
} from "../../../constants/app_constants";
import OfferCard from "../../../components/Offer/OfferCard";
import Lottie from "react-lottie";
import Animation1 from "../../../assets/lottie/animation1.json";
import Animation2 from "../../../assets/lottie/animation2.json";
import Animation3 from "../../../assets/lottie/animation3.json";
import Animation4 from "../../../assets/lottie/event.json";
import Footer from "../../../components/Footer";
import DiscountForm from "../../../components/Offer/DiscountForm";
import ComplimentaryForm from "../../../components/Offer/ComplimentaryForm";

type Props = {};

const option1 = {
  loop: true,
  autoplay: true,
  animationData: Animation1,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const option2 = {
  loop: true,
  autoplay: true,
  animationData: Animation2,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const option3 = {
  loop: true,
  autoplay: true,
  animationData: Animation4,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const boostAnimeOptions = [option1, option2, option3];
const containerStyle = {
  width: "300px", // Set the desired width
  height: "200px", // Set the desired height
};
export default function Offer({}: Props) {
  const [offer_type, setOfferType] = useState<string>("");

  console.log(offer_type);

  const onBack = () => {
    setOfferType("");
  };

  if (
    offer_type.trim().toLowerCase() ===
    Offer_Types.DISCOUNT.title.trim().toLowerCase()
  ) {
    return <DiscountForm onBack={onBack} />;
  } else if (offer_type === Offer_Types.COMPLIMENTARY.title) {
    return <ComplimentaryForm onBack={onBack} />;
  }
  return (
    <div className={styles.container}>
      <OfferHeader title="Select Your Offer Type" />

      <div className={styles.offerContainerCenter}>
        {Object.keys(Offer_Types).map((item) => {
          return (
            <OfferCard
              offerType={Offer_Types?.[item]}
              onSelect={() => {
                console.log(Offer_Types?.[item].title);
                setOfferType(Offer_Types?.[item].title);
              }}
            />
          );
          // return(<OfferType offerType={Offer_Types?.[item]}/>)
        })}
      </div>

      <OfferHeader title="How Offers Work!" />

      <div className={styles.offerContainer}>
        <div className={styles.offerInnersection}>
          <h2>Discount Based(%)</h2>
          <div className={styles.gradientDiv}>
            <ul>
              {OffersWork?.Discount.map((item, index) => {
                return <li key={index}> {item} </li>;
              })}
            </ul>
          </div>
        </div>
        <div className={styles.offerInnersection}>
          <h2>Complimentary Based(any appetizer!)</h2>
          <div className={styles.gradientDiv}>
            <ul>
              {OffersWork?.Complimentary.map((item) => {
                return <li> {item} </li>;
              })}
            </ul>
          </div>
        </div>
      </div>

      <OfferHeader title="Boost Your Business Growth" />

      <div className={styles.offerContainer}>
        <div className={styles.boostContainer}>
          {boostYourBusinessContent?.map((item, index) => {
            return (
              <div
                key={index}
                className={index == 1 ? styles.boostItem1 : styles.boostItem}
              >
                <div>
                  <h3>{item.title}</h3>
                  <ul>
                    {item.description.map((ele, index) => {
                      return <li>{ele}</li>;
                    })}
                  </ul>
                </div>
                <div style={containerStyle}>
                  <Lottie
                    options={boostAnimeOptions[index]}
                    // height={300}
                    // width={300}
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.video}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/nqUN530Rgtw?si=eMQMFZG-zq5-pviR"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>

      <Footer />
    </div>
  );
}
