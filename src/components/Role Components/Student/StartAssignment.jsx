import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';


function StartAssignment(){
    const { id } = useParams();
    return(
        <div>Id is {id}</div>
    )
}


export default StartAssignment;