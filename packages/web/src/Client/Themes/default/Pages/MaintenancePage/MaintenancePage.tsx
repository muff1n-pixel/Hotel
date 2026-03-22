import Box from '../../Components/Box/Box';
import Footer from '../../Components/Footer/Footer';
import Logo from '../../Images/logo.gif'
import './MaintenancePage.css';

const MaintenancePage = () => {
    return (
        <div className='maintenancePage'>
            <div className='resize'>
                <div className='container'>
                    <img src={Logo} alt={"Logo"} className='logo' />

                    <div className='maintenanceContent'>
                        <section className='warning'>
                            <h1>Maintenance break!</h1>
                            <p>Sorry! Pixel63 is being worked on at the moment.</p>
                            <p>We'll be back soon. We promise.</p>
                        </section>

                        <Box style={{borderRadius: 0, padding: 0, boxShadow: 'none'}} title={"What's going on?"} titleStyle={{borderRadius: 0, margin: 5}} color='grey'>
                            <div className='history'>
                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada. <a href="#">test</a>
                                    <span>about an hour ago</span>
                                </div>

                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>
                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>

                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>
                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>

                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>
                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>

                                <div className='row'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dignissim sagittis malesuada.
                                    <span>about an hour ago</span>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default MaintenancePage;