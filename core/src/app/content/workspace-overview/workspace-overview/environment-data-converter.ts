import {
  Environment,
  IEnvironment
} from './../../../shared/datamodel/k8s/environment';
import { DataConverter } from '@kyma-project/y-generic-list';
import { RemoteEnvironmentBindingService } from '../../settings/remote-environments/remote-environment-details/remote-environment-binding-service';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
export class EnvironmentDataConverter
  implements DataConverter<IEnvironment, Environment> {
  constructor(
    private remoteEnvBindingService: RemoteEnvironmentBindingService,
    private http: HttpClient
  ) {}

  convert(entry: IEnvironment): Environment {
    const environment = new Environment(entry);

    environment.remoteEnvs = this.remoteEnvBindingService
      .getBoundRemoteEnvironments(environment.getId())
      .map(boundEnvironments => {
        const envs = boundEnvironments['remoteEnvironments'];
        return envs ? envs.length : 0;
      })
      .catch(() => {
        return Observable.of(0);
      })
      .publishReplay(1)
      .refCount();

    const servicesUrl = `${
      AppConfig.k8sApiServerUrl
    }namespaces/${environment.getId()}/services`;
    environment.services = this.http
      .get<any>(servicesUrl)
      .map(res => {
        return res.items.length;
      })
      .catch(() => {
        return Observable.of(0);
      })
      .publishReplay(1)
      .refCount();

    return environment;
  }
}
