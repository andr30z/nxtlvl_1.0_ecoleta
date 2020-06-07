import React from 'react';
interface HeaderProps {
    title: String;
}

const Header: React.FC<HeaderProps> = ({title}) => {
    return (
        <div>
            {title}
        </div>
    )
}

export default Header;
