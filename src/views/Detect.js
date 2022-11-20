import { element } from "prop-types";
import React, {useRef, useState, CSSProperties} from "react";
// reactstrap components
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Label,
    Table,
    UncontrolledTooltip
  } from "reactstrap";

  import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader"

  import LightGallery from 'lightgallery/react';

  import lgThumbnail from 'lightgallery/plugins/thumbnail';
  import lgZoom from 'lightgallery/plugins/zoom';

    // import styles
    import 'lightgallery/css/lightgallery.css';
    import 'lightgallery/css/lg-zoom.css';
    import 'lightgallery/css/lg-thumbnail.css';

    // If you want you can use SCSS instead of css
    import 'lightgallery/scss/lightgallery.scss';
    import 'lightgallery/scss/lg-zoom.scss';
  
  function Detect(){
    console.log('Getting width')
    console.log(window.innerWidth * 0.5)
    const inputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState();
    const [imagePath, setImagePath] = useState('');
    const [predictionList, setPredictionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#e14eca");

    const override = {
        display: "block",
        borderColor: "red",
        marginTop: `${window.innerHeight * 0.3}px`,
        marginLeft: `${window.innerWidth * 0.3}px`,
        zIndex: 1,
        position: "fixed"
    }

    const handleUploadImageClick = () => {
        inputRef.current.click();
    }

    const handleOnChange = (e) => {
        const fileObj = e.target.files && e.target.files[0]
        if (!fileObj){
            return
        }

        setFile(fileObj)
        fileObj.name !== '' ? setFileName(fileObj.name) : setFileName('')
        

        console.log('fileObj is', fileObj);
        console.log('Name of the file : ', fileObj.name)

    }

    const getDetect = async () => {
        const formData = new FormData()
        
        if(file){
            formData.append('file', file)

            setLoading(true)
            let img_details = await fetch('/api/detect', {
                method: 'POST',
                mode:'cors',
                body: formData
            }).then(res => res.json()).then(data => {

                let rowData = data.message + ""
                let rowDataSplit = rowData.split("\n")
                let summaryDataJSON = JSON.parse(rowDataSplit[0].slice(6, -1))
                let imgSummaryDataJSON = JSON.parse(rowDataSplit[1].slice(10, -1))

                console.log("##### Check if the error and message is returened")
                console.log('Error :' + data.error )
                console.log('Message :' + data.message)
                console.log('%%%%%%% Here is the image path $$$$$$$$$$$$')
                console.log(imgSummaryDataJSON.path)
                console.log(summaryDataJSON)
                console.log(window.innerWidth)
                console.log(summaryDataJSON.prediction.split(',').slice(0, -1))
     
                const details = {
                    path: imgSummaryDataJSON.path,
                    list: summaryDataJSON.prediction.split(',').slice(0, -1)
                }
                return details
            })

            if(img_details.list.length !== 0){
                const newList = []
                const rowList = img_details.list

                for(let i in rowList){
                    console.log('Here is the value of i')
                    console.log(i)
                    console.log(rowList[i])
                    const newItem = rowList[i].split('- confidence')
                    console.log(newItem[0])
                    console.log(newItem[1])
                    const newPredictionList = {
                        a: newItem[0],
                        b: parseFloat(newItem[1])
                    }
                    newList.push(newPredictionList)
                }

                setPredictionList(newList)
            }else{
                setPredictionList([])
            }
            setImagePath(img_details.path)
            setLoading(false)
            
        }
    }
    return(
        <div className="content">
            <ClimbingBoxLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"

            />
            <Row>
            <Col md="5">
            <Card className="card-user" style={{height: 430}}>
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                </div>
                <div style={{display: 'inline-flex', width:'100%'}}>
                      <input
                            // ref={ref}
                            ref={inputRef}
                            onChange={handleOnChange}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            style={{ display: "none" }}
                            multiple={false}
                        />
                        <Button
                        block
                        color="primary"
                        onClick={handleUploadImageClick}
                        style={{flex: 0.4}}
                        >
                            <div style={{display: 'inline-flex'}}>
                            <div style={{ marginRight: 5}}>Upload</div>
                            <i className="tim-icons icon-double-right" />
                            </div>
                        </Button>
                        <div style={{fontSize: 15,
                            flex: 1,
                            height:'100%',
                            alignSelf:'center',
                            marginLeft:10,
                            wordWrap:'break-word',
                            }}> {fileName == '' ?  '' : fileName}</div>
                </div>
                
                <div>
                <Button
                    block
                    color="primary"
                    onClick={getDetect}
                    disabled={loading}
                    >
                    Detect
                    </Button>
                </div>
                <div style={{marginTop:30}}>
                    <p style={{ fontSize:'smaller'}}>
                        Object detection tool use to detect amenities that guest will mostly want to have
                        when they look to rental a space for a short or long term stay.<br/><br/>

                        This tool is trained on 15 different classes to detect most requested amenitiy base on
                        AirBnb insights.<br/><br/>

                        This tool helps property owner to better position thier rental to the right demographics
                        base on thier needs ( which is presented by the insights of AirBnb and other platforms on 
                        what usually the guest would wish they had in thier space during the stay)<br/><br/>

                        This tool uses the SOTA (State Of The Art) Computer Vision Deep Learning algorithm.
                    </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="7">
            <Card style={{ height: 430}}>
              <CardHeader>
                <h5 className="title">Result</h5>
              </CardHeader>
              <CardBody style={{ alignSelf:'center'}}>
                { imagePath == '' ?
                    <></> :
                    <diV>
                        <LightGallery plugins={[lgZoom]} mode="lg-fade">
                            <img
                                className="img-responsive"
                                src={'/api/view_img/' + imagePath}
                                alt="detect-outcome"
                                style={{ display: 'block',
                                height: window.innerHeight * 0.4,
                                width: 'auto',
                                }}
                                />
                        </LightGallery>
                    </diV>
                    }
              </CardBody>
            </Card>
          </Col>
            </Row>
            <Row>
            <Col>
            <Card className="card-tasks" style={{height: 320}}>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Accuracy ({predictionList.length})</th>
                      <th>Class</th>
                    </tr>
                  </thead>
                    <tbody>
                        {predictionList.length !== 0 ? 
                            predictionList.map((element)=>{
                                return (<tr>
                                    <td>{element.b.toFixed(3)} %</td>
                                    <td>{element.a}</td>
                                </tr>)
                            })
                         : 
                        <></>}
                      
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
            </Row>
        </div>
    )
  }

  export default Detect;