import { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import InputField from './InputField';
import { CARDS_URL } from '../constants';

function TableItem({
  cardId, nativeText, foreignText, token, setAlertMessage, setSuccess,
}) {
  const [editToggle, setEditToggle] = useState(false);
  const [formData, setFormData] = useState({
    nativeText,
    foreignText,
  });

  useEffect(() => {
    if (editToggle) setAlertMessage('');
  }, [editToggle, formData]);

  const handleOnChange = ({ target: { name, value } }) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleValidation = () => {
    setAlertMessage('');
    setSuccess(false);
    let isValid = true;
    if (formData.nativeText === '' || formData.nativeText === undefined
      || formData.foreignText === '' || formData.foreignText === undefined) {
      setAlertMessage('All fields are required.');
      isValid = false;
    }
    return isValid;
  };

  const handleUpdate = async () => {
    if (handleValidation()) {
      try {
        const response = await fetch(CARDS_URL + cardId, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccess(true);
          setAlertMessage('Saves successfully.');
        }
      } catch (error) {
        if (!error.response) {
          setAlertMessage('The server is unavailable. Try again later.');
        } else {
          setAlertMessage('Unsuccessful save.');
        }
      }
      setEditToggle(false);
    }
  };

  const handleDelete = async () => {
    setSuccess(false);
    try {
      const response = await fetch(CARDS_URL + cardId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setSuccess(true);
        setAlertMessage('Deleted successfully.');
      }
    } catch (error) {
      if (!error.response) {
        setAlertMessage('The server is unavailable. Try again later.');
      } else {
        setAlertMessage('Unsuccessful delete.');
      }
    }
  };

  return (
    <tr className="align-middle">
      {(!editToggle) ? (
        <>
          <td>{nativeText}</td>
          <td>{foreignText}</td>
          <td>
            <Icon.Pencil size={20} className="link-primary m-2" role="button" onClick={() => setEditToggle(true)} />
            <Icon.Trash size={20} className="link-danger m-2" role="button" onClick={handleDelete} />
          </td>
        </>
      ) : (
        <>
          <td>
            <InputField
              type="text"
              id="nativeText"
              name="nativeText"
              placeholder="Native word"
              value={formData.nativeText}
              handleOnChange={handleOnChange}
              mbNone
            />
          </td>
          <td>
            <InputField
              type="text"
              id="foreignText"
              name="foreignText"
              placeholder="Foreign word"
              value={formData.foreignText}
              handleOnChange={handleOnChange}
              mbNone
            />
          </td>
          <td>
            <Icon.Check2Square size={20} className="link-success m-2" role="button" onClick={handleUpdate} />
          </td>
        </>
      )}
    </tr>
  );
}

export default TableItem;
