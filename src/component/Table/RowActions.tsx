import { NavLink } from 'react-router-dom';

function RowActions(cell: any) {
    return (
        <>
            <div className="btn btn-group">
                <NavLink className={`btn btn-sm btn-secondary`} to={`${cell.row.original.id}/edit`}>
                    <i className="fa fa-edit"></i>
                </NavLink>
                <NavLink className={`btn btn-sm btn-danger`} to={`${cell.row.original.id}/delete`}>
                    <i className="fa fa-trash"></i>
                </NavLink>
            </div>
        </>
    );
}

export default RowActions;
