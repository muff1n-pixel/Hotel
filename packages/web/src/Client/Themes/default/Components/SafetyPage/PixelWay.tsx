import thumbnail_0 from '../../Images/safety/way/page_0.png';
import thumbnail_1 from '../../Images/safety/way/page_1.png';
import thumbnail_2 from '../../Images/safety/way/page_2.png';
import thumbnail_3 from '../../Images/safety/way/page_3.png';
import thumbnail_4 from '../../Images/safety/way/page_4.png';

const PixelWay = () => {
    return (
        <table>
            <tbody><tr>
                <td>
                    <h4 className='right'>Play games </h4>
                    Play with friends, create your own games, kick ass and take names!
                </td>
                <td><img src={thumbnail_0} alt="Cheat" /></td>
                <td>
                    <h4 className='wrong'>Cheat</h4>
                    Cheaters never prosper, they just end up spoiling the experience for everyone else.
                </td>
            </tr>
                <tr>
                    <td>
                        <h4 className='right'>Chat </h4>
                        Talk to your friends, get to know your fellow Habbos and meet loads of new friends... and more! ;)
                    </td>
                    <td><img src={thumbnail_1} alt="Troll" /></td>
                    <td>
                        <h4 className='wrong'>Troll</h4>
                        No one likes a troll, not even their mothers; bullying will not be tolerated by anyone.
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4 className='right'>Find that special someone </h4>
                        Flirt, Date, fall in love, and maybe meet that special someone... or something!??
                    </td>
                    <td><img src={thumbnail_2} alt="Cyber" /></td>
                    <td>
                        <h4 className='wrong'>Cyber</h4>
                        Cybering is strictly forbidden, and cam requests will result in punishment.
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4 className='right'>Help </h4>
                        Help a stranger, gain a friend! Or two, or three. You never know who you're going to meet next!
                    </td>
                    <td><img src={thumbnail_3} alt="Trick" /></td>
                    <td>
                        <h4 className='wrong'>Trick</h4>
                        Taking advantage of other Habbos usually leads to bad mojo. And lynch mobs.
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4 className='right'>Create </h4>
                        Let your creativity run wilder than a beaver in a log cabin! Push yourself to the limit in style and design- be the best!
                    </td>
                    <td><img src={thumbnail_4} alt="Script" /></td>
                    <td>
                        <h4 className='wrong'>Script</h4>
                        Make it, don't fake it! Just look at Ashlee Simpson.
                    </td>
                </tr>
            </tbody></table>
    )
}

export default PixelWay;