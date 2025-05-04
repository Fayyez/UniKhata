# starts the dummy services files
COURIER_SERVICE_PATH = "./Couriers/courier.js"
ESTORE_SERVICE_PATH = "./E-stores/estore.js"

import os
import subprocess

def run_service(service_path):
    # Get the directory containing the service
    service_dir = os.path.dirname(os.path.abspath(service_path))
    
    # Change to service directory to access its node_modules
    os.chdir(service_dir)
    
    try:
        # Start the Node.js process
        process = subprocess.Popen(['node', os.path.basename(service_path)], 
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE)
        print(f"Started service: {service_path}")
        return process
    except Exception as e:
        print(f"Error starting service {service_path}: {str(e)}")
        return None

def main():
    # Store original directory
    original_dir = os.getcwd()
    
    # Start courier service
    courier_process = run_service(COURIER_SERVICE_PATH)
    
    # Return to original directory
    os.chdir(original_dir)
    
    # Start estore service
    estore_process = run_service(ESTORE_SERVICE_PATH)
    
    if courier_process and estore_process:
        try:
            # Keep the script running while services are active
            courier_process.wait()
            estore_process.wait()
        except KeyboardInterrupt:
            print("\nShutting down services...")
            courier_process.terminate()
            estore_process.terminate()

if __name__ == "__main__":
    main()
