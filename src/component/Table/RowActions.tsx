import { EditSharp } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RowActions(cell: any) {
    return (
        <>
            <div className="btn btn-group">
                <NavLink className={`btn btn-sm btn-secondary`} to={`${cell.row.original.id}/edit`}>
                    <EditSharp />
                </NavLink>
            </div>
        </>
    );
}

export default RowActions;
