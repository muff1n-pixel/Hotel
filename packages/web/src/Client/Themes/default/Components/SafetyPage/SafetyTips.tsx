import thumbnail_0 from '../../Images/safety/tips/page_0.png';
import thumbnail_1 from '../../Images/safety/tips/page_1.png';
import thumbnail_2 from '../../Images/safety/tips/page_2.png';
import thumbnail_3 from '../../Images/safety/tips/page_3.png';
import thumbnail_4 from '../../Images/safety/tips/page_4.png';
import thumbnail_5 from '../../Images/safety/tips/page_5.png';
import thumbnail_6 from '../../Images/safety/tips/page_6.png';

const SafetyTips = () => {
    return (
        <table>
            <tbody><tr>
                <td>
                    <img src={thumbnail_0} alt="Protect Your Personal Info" />
                </td>
                <td>
                    <h4>Protect Your Personal Info</h4>
                    You never know who you're really speaking to online, so never give out your real name, address, phone numbers, photos and school. Giving away your personal info could lead to you being scammed, bullied or put in danger.
                </td>
                <td>
                    <img src={thumbnail_1} alt="Protect Your Privacy" />
                </td>
                <td>
                    <h4>Protect Your Privacy</h4>
                    Keep your Skype, MSN, Facebook details private. You never know where it might lead you.
                </td>
            </tr>
                <tr>
                    <td>
                        <img src={thumbnail_2} alt="Don't Give In To Peer Pressure" />
                    </td>
                    <td>
                        <h4>Don't Give In To Peer Pressure</h4>
                        Just because everyone else seems to be doing it, if you're not comfortable with it, don't do it!
                    </td>
                    <td>
                        <img src={thumbnail_3} alt="Keep Your Pals In Pixels" />
                    </td>
                    <td>
                        <h4>Keep Your Pals In Pixels</h4>
                        Never meet up with people you only know from the internet, people aren't always who they claim to be. If someone asks you to meet with them in real life say "No thanks!" and tell a moderator, your parents or another trusted adult.
                    </td>
                </tr>
                <tr>
                    <td>
                        <img src={thumbnail_4} alt="Don't Be Scared To Speak Up" />
                    </td>
                    <td>
                        <h4>Don't Be Scared To Speak Up</h4>
                        If someone is making you feel uncomfortable or scaring you with threats in Habbo, report them immediately to a moderator using the Panic Button.
                    </td>
                    <td>
                        <img src={thumbnail_5} alt="Ban The Cam" />
                    </td>
                    <td>
                        <h4>Ban The Cam</h4>
                        You have no control over your photos and webcam images once you share them over the internet and you can't get them back. They can be shared with anyone, anywhere and be used to bully or blackmail or threaten you. Before you post a pic, ask yourself, are you comfortable with people you don't know viewing it?
                    </td>
                </tr>
                <tr>
                    <td>
                        <img src={thumbnail_6} alt="Be A Smart Surfer" />
                    </td>
                    <td>
                        <h4>Be A Smart Surfer</h4>
                        Websites that offer you free Credits, Furni, or pretend to be new Habbo Hotel or Staff homepages are all scams designed to steal your password. Don't give them your details and never download files from them; they could be keyloggers or viruses!
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default SafetyTips;