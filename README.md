# ThenrasuClinic

## Docker

This project includes Docker support for the backend, frontend, and MongoDB.

### Run with Docker Compose

From the project root (`e:/thenarasu pj`):

```bash
docker compose up --build
```

### Services

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- MongoDB: `mongodb://localhost:27017`

### Notes

- The backend uses `backend/Dockerfile`.
- The frontend uses `thenarasu-multispec/Dockerfile`.
- MongoDB data is stored in the Docker volume `mongo-data`.
