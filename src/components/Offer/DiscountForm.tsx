import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Card, CardContent, CircularProgress, FormControlLabel, InputAdornment, Radio, RadioGroup } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Merchant } from '../../@types/interfaces/merchant';
import { colors } from '../../constants/colors';
import { db } from '../../firebase';
import { setPopup } from '../../store/reducer/app-data';
import { useAppDispatch, useAppSelector } from '../../store/store/store';
import { getCurrentDate } from '../../utils/date';
import { getOfferColor, getOfferFont, subtitle } from '../../utils/offer';
import styles from './offer.module.css';

import Lottie from 'react-lottie';
import offerAdded from '../../assets/lottie/offeradded.json';
// Components Here


type Props = {
  onBack: () => void
}

export const label = { color: colors.black, fontWeight: '600' }


const DiscountForm = ({ onBack }: Props) => {
  const [discount, setDiscount] = useState(10);
  const [maxCap, setMaxCap] = useState('No Limit');
  const [timing, setTiming] = useState('All Day (24 hrs)');
  const [startDate, setStartDate] = useState('');
  const [minOrderType, setMinOrderType] = useState('value');
  const [minOrder, setMinOrder] = useState(150); // Changed variable name

  const [errors, setErrors] = useState({});
  const [customMaxCap, setCustomMaxCap] = useState(''); // To store the custom max cap value
  const [isCustomMaxCapDialogOpen, setCustomMaxCapDialogOpen] = useState(false);
  const [capValues, setCapValues] = useState(['No Limit', 'Upto 50', 'Upto 75', 'Upto 100', 'Upto 150'])

  const { userInfo } = useAppSelector(state => state.user) as { userInfo: Merchant };

  const offerCollection = collection(db, 'offers', userInfo?.country || '', userInfo?.state || '', userInfo?.division || '',userInfo?.district|| '',userInfo?.username || '','alloffers');
  const dispatch = useAppDispatch();
  const [adding, setAdding] = useState(false);
  const [play,setPlayAnimation] = useState(false);
  // const [options,]

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: offerAdded,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    },
  };

  const handleMinOrderTypeChange = (event) => {
    setMinOrderType(event.target.value);

    // Reset the minimum order value when the type changes
    if (event.target.value === 'value')
      setMinOrder(150);
    else setMinOrder(1);
  };

  const handleMinOrderChange = (event) => {
    setMinOrder(event.target.value);
  };

  const handleDiscountChange = (event, newValue) => {
    setDiscount(newValue);
  };

  const handleMaxCapChange = (event) => {
    const selectedMaxCap = event.target.value;
    if (selectedMaxCap === 'Add your own') {
      setCustomMaxCapDialogOpen(true);
    } else {
      setMaxCap(selectedMaxCap);
    }
  };

  const handleTimingChange = (event) => {
    setTiming(event.target.value);

  };

  const handleStartDateChange = (event) => {
    if (errors.startDate)
      setErrors({ startDate: undefined })
    setStartDate(event.target.value);
  };


  const handleCustomMaxCapDialogClose = () => {
    setCustomMaxCapDialogOpen(false);
  };

  useEffect(() => {
    if (customMaxCap && capValues.length > 5) {
      setMaxCap(capValues[capValues.length - 1])
      setCustomMaxCap('')
    }
  }, [capValues])

  const handleCustomMaxCapSave = () => {
    if (customMaxCap) {
      setCapValues(prevState => [...prevState, 'Upto ' + customMaxCap])
      setCustomMaxCapDialogOpen(false);
    }
  };

  const handleDataSave = (data) => {
    // const docRef = doc(db, docRefrenc,);
    if (data) {
      setAdding(true);
      addDoc(offerCollection, data).then(async (response) => {
        //setting to original
        console.log({ ...userInfo, image: subtitle(data) })
        // await userDetailsService.broadcast({...userInfo,image:subtitle(data)});
        setTiming('All Day (24 hrs)');
        setStartDate('');
        dispatch(setPopup({ open: true, severity: "success", message: "Offer Added Successfully🥳" }));
        setPlayAnimation(true)
      }).catch(err => dispatch(setPopup({ open: true, severity: "error", message: "Something went Wrong!" })))
        .finally(() => {
          setAdding(false);
        });
    }
  }


 

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation

    const offer = {
      title: discount + " % Off ",
      discount,
      startDate,
      timing,
      minOrder,
      minOrderType,
      limit: maxCap,
      active: true,
      offer_type: "Discount",
      place_type: userInfo?.type
    }

    const newErrors = {};
    if (discount < 10 || discount > 60) {
      newErrors.discount = 'Discount must be between 10% and 60%';
    }
    if (minOrder < 0) {
      newErrors.minOrder = 'Minimum order value cannot be negative';
    }
    if (!startDate) {
      newErrors.startDate = 'Start Date is required';
    }
    console.log(newErrors)
    if (Object.keys(newErrors).length === 0) {
      // Submit the form or perform other actions here
      handleDataSave(offer)
    }
    else {
      setErrors(newErrors);
    }
  };
  




  return (
    <>
    
     {play &&  <div className={styles.popper}>
        <Lottie
      options={defaultOptions}
      eventListeners={
        [
          {
            eventName: 'complete',
            callback: () => {
              console.log('Animation completed');
              setPlayAnimation(false)
            },
          },
          {
            eventName: 'loopComplete',
            callback: () => {
              console.log('Loop completed');
            },
          }]
      } 
    />
      </div>}
     
      <form onSubmit={handleSubmit}>

        <div>
          <Typography variant="h4" align="center" color={colors.primary} style={{ marginTop: '0.5rem', marginBottom: '1.2rem' }}>
            <IconButton
              onClick={onBack}
              color="primary"
              aria-label="back"
              style={{
                backgroundColor: colors.veryLightBlue,
                padding: 5, borderRadius: 12, marginRight: 5
              }}>
              <ArrowBackIosIcon width={20} height={20} />
            </IconButton>
            Discount Based
          </Typography>
        </div>
        <div>

          <div className={styles.main}>

            <div className={styles.container}>
              <h3 className={styles.title}>Add Discount</h3>
              <div className={styles.box}>
                <InputLabel htmlFor="discount" style={label}>Discount (%)</InputLabel>
                <div className={styles.input}>
                  <Slider
                    value={discount}
                    min={10}
                    max={60}
                    step={5}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    onChange={handleDiscountChange}
                  />
                  <Typography variant='h4' color={getOfferColor(discount)}
                    sx={{ fontSize: getOfferFont(discount) }}>{discount}%</Typography></div>
              </div>

              <div className={styles.box}>
                <InputLabel htmlFor="maxCap" style={label}>Maximum Upto</InputLabel>
                <div className={styles.input}>
                  <Select
                    value={maxCap}
                    onChange={handleMaxCapChange}
                  >
                    {capValues?.map(item => <MenuItem value={item}>{item}</MenuItem>)}
                    <MenuItem value="Add your own">Add your own</MenuItem>
                  </Select></div>

              </div>

              <div className={styles.box}>
                <InputLabel htmlFor="timing" style={label}>Timing</InputLabel>
                <div className={styles.input}>
                  <Select
                    value={timing}
                    onChange={handleTimingChange}
                  >
                    <MenuItem value="All Day (24 hrs)">All Day (24 hrs)</MenuItem>
                    <MenuItem value="Morning (7am - 12pm)">Morning (7 - 12)</MenuItem>
                    <MenuItem value="Afternoon (12pm - 4pm)">Afternoon (12 - 4)</MenuItem>
                    <MenuItem value="Evening (4pm - 8pm)">Evening (4 - 8)</MenuItem>
                    <MenuItem value="Night (8pm - 12pm)">Night (8 - 12)</MenuItem>
                  </Select></div>
              </div>

              <div className={styles.box}>
                <InputLabel htmlFor="startDate" style={label}>Start Date</InputLabel>
                <div className={styles.input}>
                  <TextField
                    error={errors.startDate ? true : false}
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: { min: getCurrentDate() }, // Pass the minimum date
                    }}
                    helperText={errors.startDate ? "Start Date is Required." : null}
                  /></div>
                {/* {errors.startDate && <Typo>{errors.startDate}</div>} */}
              </div>


              <div className={styles.box}>
                <InputLabel htmlFor="minOrderType" style={label}>Minimum Order</InputLabel>
                <div className={styles.input}>
                  <RadioGroup
                    aria-label="Minimum Order Type"
                    name="minOrderType"
                    value={minOrderType}
                    onChange={handleMinOrderTypeChange}
                  >
                    <FormControlLabel
                      value="value"
                      control={<Radio />}
                      label="Value"
                    />
                    <FormControlLabel
                      value="quantity"
                      control={<Radio />}
                      label="Quantity"
                    />
                  </RadioGroup>
                  {minOrderType === 'value' && (
                    <TextField
                      id="minOrder"
                      type="number"
                      label="Minimum Order (Rs.)"
                      value={minOrder}
                      onChange={handleMinOrderChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            ₹
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  {minOrderType === 'quantity' && (
                    <TextField
                      id="minOrder"
                      type="number"
                      label="Minimum Order Quantity"
                      value={minOrder}
                      onChange={handleMinOrderChange}
                    />
                  )}
                  {errors.minOrder && <div>{errors.minOrder}</div>}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.3rem' }}>
                <Button type="submit" variant="contained" color="primary" disabled={adding} style={{ width: '20%' }}>
                  {adding ? <CircularProgress size={16} /> : 'Submit'}
                </Button>
              </div>
            </div>

            <div className={styles.container}>
              <h3 className={styles.title}>Preview</h3>

              <div className={styles.cardContainer}>
                <div className={styles.preview}>
                  <h4 style={{ fontSize: getOfferFont(discount) }}>{subtitle({
                    discount,
                    startDate,
                    timing,
                    minOrder,
                    minOrderType,
                    limit: maxCap,
                    offer_type: "Discount"
                  })}</h4>
                  <h4>Timing: {timing}</h4>
                  <h4>Starts By: {startDate}</h4>

                  {minOrderType === 'value' ? (
                    <h5>Minimum Order of Rs. {minOrder} to Avail this Offer</h5>
                  ) : <h5>Minimum Order {minOrder} item to Avail this offer</h5>}
                </div>
              </div>
            </div>

          </div>


        </div>

        <Dialog open={isCustomMaxCapDialogOpen} onClose={handleCustomMaxCapDialogClose}>
          <DialogContent>
            <TextField
              label="Custom Max Cap"
              type="number"
              value={customMaxCap}
              onChange={(e) => setCustomMaxCap(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCustomMaxCapDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCustomMaxCapSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </>

  );
};

export default DiscountForm;
