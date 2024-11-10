import { Link, useNavigate } from 'react-router-dom';
import './Header.css'
//import '../App.css'; // or './styles.css' depending on your setup

import { FaSearch } from "react-icons/fa";
import { useState } from 'react';

function Header(props) {

    const [loc, setLoc] = useState(null)
    const [showOver, setshowOver] = useState(false)

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    }

    let locations = [
        {
            "latitude": 28.3562179,
            "longitude":75.5855782,
            "placeName": "Bits Pilani"
        }
      
    ]

    return (
        <div className='header-container d-flex justify-content-between'>

            <div className="header">
                <Link className='links' to="/">
                <img src="/bolxfinal.png" alt="Logo" className="logo-image" />

                </Link>
                <span style={{color: '#4d2270'}}>{locations[0].placeName}</span> {/* Displaying the single location */}
                <input className='search'
                    type='text'
                    placeholder='Search'
                    value={props && props.search}
                    onChange={(e) => props.handlesearch && props.handlesearch(e.target.value)
                    }
                />
                <button className='search-btn' onClick={() => props.handleClick && props.handleClick()} > <FaSearch /> </button>
            </div>

            <div>







                <div
                    onClick={() => {
                        setshowOver(!showOver)
                    }}
                    style={{
                        display: 'flex',
                        background: ' #b587db', /* Darker lilac */

                        justifyContent: 'center',
                        alignItems: 'center',
                        //background: '#002f34',
                        width: '80px',
                        height: '40px',
                        color: 'black',
                        fontSize: '14px',
                        borderRadius: '5px',
                        cursor:'pointer'
                    }} >  Options </div>

                {showOver && <div style={{
                    minHeight: '100px',
                    width: '200px',
                    background: '#BFA0D8',
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    zIndex: 1,
                    marginTop: '50px',
                    marginRight: '50px',
                    color: 'red',
                    fontSize: '14px',
                    background: ' #b587db',
                    borderRadius: '7px',
                    cursor: 'pointer'
                }}>
                    <div>
                        {!!localStorage.getItem('token') &&
                            <Link to="/my-profile">
                                <button className="logout-btn">MYPROFILE</button>
                            </Link>}
                    </div>
                    <div>
                        {!!localStorage.getItem('token') &&
                            <Link to="/add-product">
                                <button className="logout-btn">ADD PRODUCT  </button>
                            </Link>}
                    </div>
                    <div>
                        {!!localStorage.getItem('token') &&
                            <Link to="/liked-products">
                                <button className="logout-btn"> FAVOURITES  </button>
                            </Link>}
                    </div>
                    <div>
                        {!!localStorage.getItem('token') &&
                            <Link to="/my-products">
                                <button className="logout-btn">MY ADS  </button>
                            </Link>}
                    </div>
                    <div>
                        {!localStorage.getItem('token') ?
                            <Link to="/login" style={{ display: 'block', textAlign: 'center', margin: '40px auto 0', color:'black' }}>
                                LOGIN
                            </Link>:
                      
                            //<Link to="/login">  LOGIN </Link> :
                            <button className='logout-btn' onClick={handleLogout}> LOGOUT </button>}
                    </div>



                </div>}
            </div>

        </div>
    )
}


export default Header;