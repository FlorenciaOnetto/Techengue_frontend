// PerfilMascota.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PerfilMascota.css';

export default function PerfilMascota() {
    const { idMascota } = useParams();
    const [mascota, setMascota] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isOwner, setIsOwner] = useState(false); // Estado para verificar si es el dueño
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMascota = async () => {
            try {
                const response = await fetch(`http://localhost:3000/mascotas/${idMascota}`);
                const data = await response.json();
                setMascota(data);

                // Verificar si el usuario es el dueño de la mascota
                const token = localStorage.getItem('token');
                if (token) {
                    const userData = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
                    if (data.id_usuario === userData.id) { // Verificar si el ID del usuario coincide
                        setIsOwner(true);
                    }
                }
            } catch (error) {
                console.error("Error al cargar la mascota:", error);
            }
        };

        fetchMascota();
    }, [idMascota]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleConfirmChanges = async () => {
        const confirm = window.confirm("¿Estás seguro que deseas confirmar los cambios?");
        if (!confirm) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/mascotas/${mascota.id_mascota}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mascota)
            });

            if (response.ok) {
                const updatedMascota = await response.json();
                setMascota(updatedMascota);
                setIsEditing(false);
                alert("Cambios guardados exitosamente.");
                navigate('/perfilusuario'); // Redirigir al perfil de usuario
            } else {
                console.error("Error al actualizar la mascota.");
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMascota({
            ...mascota,
            [name]: value,
        });
    };

    if (!mascota) return <p>Cargando...</p>;

    const handleSolicitudClick = () => {
        navigate(`/SolicitudAdopcion/${idMascota}`);
    };

    return (
        <div className="pet-profile">
            <div className="profile-card">
                <img src={`http://localhost:3000/uploads/${mascota.fotos}`} alt={mascota.nombre} className="pet-image" />
                <div className="pet-details">
                    <h2>{mascota.nombre}</h2>

                    {isEditing ? (
                        <>
                            <p>
                                <strong>Nombre:</strong>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={mascota.nombre}
                                    onChange={handleInputChange}
                                />
                            </p>
                            <p>
                                <strong>Edad:</strong>
                                <input
                                    type="number"
                                    name="edad_aproximada"
                                    value={mascota.edad_aproximada}
                                    onChange={handleInputChange}
                                />
                                <select
                                    name="edad_unidad"
                                    value={mascota.edad_unidad}
                                    onChange={handleInputChange}
                                >
                                    <option value="meses">Meses</option>
                                    <option value="años">Años</option>
                                </select>
                            </p>
                            <p>
                                <strong>Porte:</strong>
                                <input
                                    type="text"
                                    name="tamano_aproximado"
                                    value={mascota.tamano_aproximado}
                                    onChange={handleInputChange}
                                />
                            </p>
                            <p>
                                <strong>Raza:</strong>
                                <input
                                    type="text"
                                    name="raza"
                                    value={mascota.raza}
                                    onChange={handleInputChange}
                                />
                            </p>
                            <p>
                                <strong>Comportamiento:</strong>
                                <textarea
                                    name="comportamiento"
                                    value={mascota.comportamiento}
                                    onChange={handleInputChange}
                                />
                            </p>
                            <p>
                                <strong>Salud:</strong>
                                <select
                                    name="salud"
                                    value={mascota.salud ? 'true' : 'false'}
                                    onChange={(e) => handleInputChange({ target: { name: 'salud', value: e.target.value === 'true' } })}
                                >
                                    <option value="true">Con problemas de salud</option>
                                    <option value="false">No tiene problemas de salud</option>
                                </select>
                            </p>
                            {mascota.salud && (
                                <p>
                                    <strong>Detalles de Salud:</strong>
                                    <input
                                        type="text"
                                        name="detallesSalud"
                                        value={mascota.detallesSalud || ''}
                                        onChange={handleInputChange}
                                    />
                                </p>
                            )}
                            <p>
                                <strong>Especie:</strong>
                                <input
                                    type="text"
                                    name="especie"
                                    value={mascota.especie}
                                    onChange={handleInputChange}
                                />
                            </p>
                            <p>
                                <strong>Región:</strong>
                                <input
                                    type="text"
                                    name="region"
                                    value={mascota.region}
                                    onChange={handleInputChange}
                                />
                            </p>
                            <button className="edit-button" onClick={handleConfirmChanges}>Confirmar cambios</button>
                        </>
                    ) : (
                        <>
                            <p><strong>Edad:</strong> {mascota.edad_aproximada} {mascota.edad_unidad}</p>
                            <p><strong>Porte:</strong> {mascota.tamano_aproximado}</p>
                            <p><strong>Raza:</strong> {mascota.raza}</p>
                            <p><strong>Comportamiento:</strong> {mascota.comportamiento}</p>
                            <p><strong>Salud:</strong> {mascota.salud ? 'Con problemas de salud' : 'No tiene problemas de salud'}</p>
                            {mascota.salud && <p><strong>Detalles de Salud:</strong> {mascota.detallesSalud}</p>}
                            <p><strong>Especie:</strong> {mascota.especie}</p>
                            <p><strong>Región:</strong> {mascota.region}</p>
                            <div className="button-container">
                                <button className="contact-button">Contactar Guardian</button>
                                <button className="adoption-button" onClick={handleSolicitudClick}>Enviar Solicitud Adopción</button>
                                {isOwner && <button className="edit-button" onClick={handleEdit}>Editar</button>} {/* Mostrar botón de editar solo si el usuario es el dueño */}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}