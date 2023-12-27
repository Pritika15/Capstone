import {useContext, useState} from "react";
import close from "../assets/images/icon/close.svg";
import {DataContext} from "./data_hook";
import {useNavigate} from "react-router";

export const HomePage = () => {
    const [error, setError] = useState("");
    const [tweet, setTweet] = useState("");
    const [popup, setPopup] = useState(false);
    const [columns, setColumns] = useState([])
    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedDateColumn, setSelectedDateColumn] = useState("");
    const [selectedEmoji, setSelectedEmoji] = useState("non-emoji");
    const [selectedFile, setSelectFile] = useState("");
    const navigate = useNavigate();
    const [state, setState] = useContext(DataContext);
    const topics = ["International Relations and Political Leadership ",
        "Military Actions and Attacks ", "Humanitarian Support and Needs",
        "Global Economy and Sanctions", "Political Figures and Commentary",
        "Human Impact and Casualties", "Media and News Coverage",
        "Public Opinion and Urgency",
        "Geopolitics and Weapons", "Military Technology and Equipment"]
    const [selectTopic, setSelectTopic] = useState(topics[0]);

    function handleCsvSubmit(event) {
        if (document.getElementById("uploadBox").value != "") {
            // you have a file
            const form = event.currentTarget;
            const formData = new FormData(form);

            const fetchOptions = {
                method: form.method,
            };
            fetchOptions.body = formData;
            fetch("http://127.0.0.1:5000/csv_analysis", fetchOptions)
                .then(r => r.json())
                .then(d => {
                    setColumns(d['columns'])
                    setSelectFile(d['filename'])
                }).then(() => setPopup(true));

        } else if (tweet !== "") {
            // Call single Tweet Api here

            fetch('http://127.0.0.1:5000/single_tweet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tweet: tweet,
                    topic: selectTopic,
                    emoji: selectedEmoji
                }) // Replace 'your_data_here' with the actual data to be preprocessed
            })
            .then(response => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log(data)
                        setError(data["message"])
                    });    
                } else {
                   console.error('Sentiment failed');
                }
            })
            .catch(error => {
                console.error('Error occurred during data preprocessing:', error);
            });

            // setState({
            //     datasetUploaded: false,
            //     data: tweet,
            //     topic: selectTopic
            // });
            // navigate('/progressbar')
        } else {
            console.log("File/Text not Found ")
            setError("Please Select File or Enter Text in InputField")
        }


        event.preventDefault();
    }

    return (<div className="home_content">
            <div className="max_width">
                <div className="heading_container">
                    <div className="main_heading">
                        Contextual Analysis Project!
                    </div>
                    <div className="sub_text">
                        The Russia-Ukraine war, also known as the Russo-Ukrainian conflict, is a ongoing conflict
                        between Russia and Ukraine that began in 2014. At its core, it's a struggle for control over
                        Crimea, a region in Ukraine that Russia annexed in 2014, as well as for influence over other
                        parts of Ukraine.
                    </div>
                </div>
                <div className="highlight_container">
                    <div className="heading">
                        Some Highlights
                    </div>
                    <div className="container">
                        <div className="card">
                            <div className="card_heading">
                                Emotions
                            </div>
                            <div className="highlights_list">
                                <div className="heading">
                                    Top emotions ongoing
                                </div>
                                <ul>
                                    <li className="analysis_node">
                                        Anger (32%)
                                    </li>
                                    <li className="analysis_node">
                                        Sadness (40%)
                                    </li>
                                    <li className="analysis_node">
                                        Despair (10%)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card_heading">
                                Top Keywords
                            </div>
                            <div className="highlights_list">
                                {/*<div className="heading">*/}
                                {/*    Top emotions ongoing*/}
                                {/*</div>*/}
                                <ul>
                                    <li className="analysis_node">
                                        Casualty (49%)
                                    </li>
                                    <li className="analysis_node">
                                        Pray (20%)
                                    </li>
                                    <li className="analysis_node">
                                        Attack (10%)
                                    </li>
                                    <li className="analysis_node">
                                        Peace (4%)
                                    </li>
                                    <li className="analysis_node">
                                        Oil (2%)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card_heading">
                                Top Topics
                            </div>
                            <div className="highlights_list">
                                <div className="heading">
                                    Topics that are being discussed the most
                                </div>
                                <ul>
                                    <li className="analysis_node">
                                        Energy and Economy (20%)
                                    </li>
                                    <li className="analysis_node">
                                        Military Operations and Attacks (40%)
                                    </li>
                                    <li className="analysis_node">
                                        Nuclear Threat and Security Concerns (10%)
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card_heading">
                                Statistics
                            </div>
                            <div className="highlights_list">
                                <div className="heading">
                                    Topics that are being discussed the most
                                </div>
                                <ul>
                                    <li className="analysis_node">
                                        Total words - 81287832
                                    </li>
                                    <li className="analysis_node">
                                        Avg words per tweet - 27
                                    </li>
                                    <li className="analysis_node">
                                        Positive words - 1851496948
                                    </li>
                                    <li className="analysis_node">
                                        Negative words - 23866150
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="analysis_container">
                    <div className="heading">
                        Analysis
                    </div>

                    <form onSubmit={handleCsvSubmit} method="post">
                        <select className="topic_selection" onChange={(v) => setSelectTopic(v.target.value)}>
                            {topics.map(v => <option value={v}>{v}</option>)}
                        </select>
                        <br/>
                        <br/>
                        {/*<div className={"divider"}>OR</div>*/}
                        <textarea className={"tweet_area"} name="tweet" id="" cols="30" rows="8" value={tweet}
                                  placeholder={"Enter Your Tweet Here"}
                                  onChange={(e) => setTweet(e.target.value)}
                        />
                        <br/>
                        <br/>
                        <div className={"divider"}>OR</div>
                        <br/>
                        <input id={"uploadBox"} type="file" name="file" accept="text/csv"/>
                        <button className="analysis_button" type={"submit"}>
                            Analysis
                        </button>
                    </form>
                </div>


                {/* This is pop page for options like Analysis of topic or sentiment*/}
                {/*This was used in old evaluation*/}
                {
                    popup ? <div className="analysis_popup">
                        <img className={"close"} src={close} alt=""
                             onClick={() => setPopup(false)}/>
                        {/*<div className="textfield">*/}
                        {/*    <input type="text" value={"Choose the Column"} disabled/>*/}
                        {/*</div>*/}
                        <div className="analysis_popup_main_heading">
                            Choose the Column
                        </div>
                        <div className="analysis_popup_sub_text">
                            Select column which contains the text data
                        </div>
                        <div className="container">
                            <select name="" id="" className={"select_column"}

                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        setSelectedColumn(e.target.value);
                                    }}>
                                {
                                    columns.map((value, index, array) => <option key={index}
                                                                                 value={value}>{value}</option>
                                    )
                                }
                            </select>
                            <div className="analysis_popup_sub_text">
                                Select column which contains the date data
                            </div>
                            <select name="" id="" className={"select_column"}
                            onChange={(e) => {
                                setSelectedDateColumn(e.target.value);
                            }}>
                            {
                            columns.map((value, index, array) => <option key={index}
                                                                        value={value}>{value}</option>
                            )
                            }
                            </select>
                            
                            <div className="analysis_popup_sub_text">
                                Emoji/Non Emoji
                            </div>
                            <select name="" id="" className={"select_column"}
                            onChange={(e) => {
                                setSelectedEmoji(e.target.value);
                            }}>
                            
                            <option key="emoji" value="emoji">emoji</option>
                            <option key="non-emoji" value="non-emoji">non-emoji</option>
                            </select>


                            <button className="popup_btn" onClick={() => {
                                if (tweet !== "") {
                                    setState({
                                        datasetUploaded: true,
                                        selectedColumn: selectedColumn,
                                        selectedDateColumn: selectedDateColumn,
                                        data: tweet,
                                        topic: selectTopic,
                                        filename: selectedFile
                                    });
                                } else {
                                    setState({
                                        datasetUploaded: true,
                                        selectedColumn: selectedColumn,
                                        selectedDateColumn: selectedDateColumn,
                                        topic: selectTopic,
                                        filename: selectedFile,
                                        emoji: selectedEmoji,
                                        selectedDateColumn: selectedDateColumn,
                                    });
                                }
                                navigate('/progressbar')
                            }}>Get Full Report
                            </button>
                        </div>
                    </div> : ""
                }
            </div>
            {error !== "" ?
                <div className="errorBox" onClick={() => setError("")}>
                    <div className="errorText">{error}
                    </div>
                </div> : ""
            }
        </div>
    )
}