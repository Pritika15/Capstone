import './proressbar.css'
import {useEffect, useState} from "react";
import {faBrush, faCode, faFlask, faRocket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router";
import {useContext} from "react";
import {DataContext} from "./data_hook";

export const ProgressBar = () => {
    const [status, setStatus] = useState(false);
    const [state, setState] = useContext(DataContext);

    console.log(state)

    const navigate = useNavigate();

    const progressData = {
        "first": {
            heading: "Preprocessing Data",
            subheading: "The cryptic yet anticipatory message, \"Data is in preprocessing, please wait,\" serves as a portal into the intricate world where raw data undergoes a transformative journey to shed its imperfections and don a refined guise. At the heart of this process lies the imperative need to expunge extraneous noise and refine the dataset, as preprocessing takes center stage to cleanse the data of junk, inconsistencies, and outliers. This meticulous purification is not merely a routine but a crucial rite that readies the data for a myriad of applications, making algorithms adaptable to a broad spectrum of use cases. It's a surgical intervention into the raw material, meticulously removing impurities and ensuring that the algorithms operate with a clarity that transcends the noise inherent in unprocessed data. As we patiently await the completion of this preprocessing alchemy, we recognize it as the gateway to unleashing the true potential of the data, paving the way for versatile and robust algorithms capable of navigating a wide array of real-world scenarios with finesse and accuracy."
        },
        "second": {
            heading: "Analyzing Topics",
            subheading: "We are currently in the process of analyzing your topics. This may take a few minutes as we employ advanced genetic algorithms to determine the optimal configuration and weights for various models. Additionally, each individual model is finely tuned for specific tasks, ensuring optimal performance. Please be patient while we complete this process."
        },
        "third": {
            heading: "Analyzing Sentiments",
            subheading: "We are currently in the process of analyzing your sentiments. Please be patient while we complete this process."
        },
        "fourth": {
            heading: "Generating Summary",
            subheading: "We're on the verge of completion, currently in the process of gathering the final elements and crafting concise summaries. Your patience is truly valued as we prepare to unveil something delightful. Rest assured, the culmination of our efforts is poised to bring you a sweet and satisfying outcome. Thank you for your patience; the anticipation will soon be rewarded with a thoughtful and compelling conclusion."
        },

    }

    const generate_summary_and_navigate = () => {
        fetch('http://127.0.0.1:5000/summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state) // Replace 'your_data_here' with the actual data to be preprocessed
        })
        .then(response => {
            if (response.ok) {
                // Decode json and set results
                response.json().then((data) => {
                    console.log(data)
                    setState((prevState) => {
                        return {...prevState, summary: data}
                    });
                    navigate('/topic_detail')
                });
            } else {
               console.error('Sentiment failed');
            }
        })
        .catch(error => {
            console.error('Error occurred during data preprocessing:', error);
        });
    }

    const start_sentiment_analysis = () => {
        fetch('http://127.0.0.1:5000/sentiment_analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state) // Replace 'your_data_here' with the actual data to be preprocessed
        })
        .then(response => {
            if (response.ok) {
                console.log('Sentiment successful');
                setNodes("fourth")
                generate_summary_and_navigate()
            } else {
               console.error('Sentiment failed');
            }
        })
        .catch(error => {
            console.error('Error occurred during data preprocessing:', error);
        });
    }

    const start_topic_analysis = () => {
        fetch('http://127.0.0.1:5000/topic_analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state) // Replace 'your_data_here' with the actual data to be preprocessed
        })
        .then(response => {
            if (response.ok) {
                // Preprocessing successful
                console.log('Topic analysis successful');
                setNodes("third")
                start_sentiment_analysis()
            } else {
                // Preprocessing failed
                console.error('Topic analysis failed');
            }
        })
        .catch(error => {
            console.error('Error occurred during data preprocessing:', error);
        });
    }

    // Function to make the API call for preprocessing
    const preprocessData = () => {
        fetch('http://127.0.0.1:5000/preprocess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(state) // Replace 'your_data_here' with the actual data to be preprocessed
        })
        .then(response => {
            if (response.ok) {
                // Preprocessing successful
                console.log('Data preprocessing successful');
                setNodes("second")
                start_topic_analysis(state)
            } else {
                // Preprocessing failed
                console.error('Data preprocessing failed');
            }
        })
        .catch(error => {
            console.error('Error occurred during data preprocessing:', error);
        });
    };
    
    // Function to call after 1 second
    const callFunctionAfterDelay = () => {
        setTimeout(() => {
            // Call your function here
            preprocessData();
        }, 1000); // 1000 milliseconds = 1 second
    };

    // Start preprocessing on component mount
    // Remove the following useEffect TODO: Test only
    useEffect(() => {
        setState({
            datasetUploaded: true,
            selectedColumn: "text",
            topic: "International Relations and Political Leadership",
            filename: "output.csv"
        });
    }, [])

    useEffect(() => {
        console.log("State call me")
        console.log(state)
        if (Object.keys(state).length === 0)
            console.log("State is empty")
            callFunctionAfterDelay();
    }, [state]);

    const [selectedNode, setNodes] = useState("first");
    useEffect(() => {
        switch (selectedNode) {
            case "first": {
                document.getElementById("span1").classList.add("border-change")
                document.getElementById("nprogress-bar").value = 0;
                break;
            }
            case "second": {
                document.getElementById("span2").classList.add("border-change")
                document.getElementById("nprogress-bar").value = 37;
                break;
            }
            case "third": {
                document.getElementById("span3").classList.add("border-change")
                document.getElementById("nprogress-bar").value = 64;
                break;
            }
            case "fourth": {
                document.getElementById("span4").classList.add("border-change")
                document.getElementById("nprogress-bar").value = 100;
                break;
            }
        }
    }, [selectedNode])

    // Implement the logic to change the progress bar by polling server every 5 seconds
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (selectedNode === "first") {
    //             setNodes("second")
    //         } else if (selectedNode === "second") {
    //             setNodes("third")
    //         } else if (selectedNode === "third") {
    //             setNodes("fourth")
    //             setTimeout(() => {
    //                 navigate('/topic_detail') // Call the navigate function after 1 second
    //             }, 1000);        
    //         }
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, [selectedNode]);

    return (
        <>
            <h1 className="text-center"> WEB DESIGN PROCESS</h1>
            <div className="row">
                <div className="cont">
                    <progress id="nprogress-bar" value="0" max="100"/>
                    <div id="step">
                        <span id={"span1"} className="first border-change">


                        <FontAwesomeIcon className={"closeModal"} icon={faFlask}
                        />

                        </span>
                        <span id={"span2"} className="second">
                        <FontAwesomeIcon className={"closeModal"} icon={faBrush}/>
                        </span>
                        <span id={"span3"} className="third">
                              <FontAwesomeIcon className={"closeModal"} icon={faCode}
                              />
                        </span>
                        <span id={"span4"} className="fourth">
                               <FontAwesomeIcon className={"closeModal"} icon={faRocket}
                               />
                        </span>
                    </div>
                </div>
            </div>

            <div className="progress_container">
                <h2>{progressData[selectedNode].heading}</h2>
                <p>{progressData[selectedNode].subheading}</p>
            </div>

        </>
    );
}