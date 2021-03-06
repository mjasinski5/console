import { Observable } from 'rxjs/Observable';
import { Deployment, IDeployment, IDeploymentStatus } from './deployment';
import { Service, IServiceSpec } from './service';
import { IMetaDataOwner, MetaDataOwner } from './generic/meta-data-owner';
import { IPodTemplate } from './pod-template';

export interface IFunction extends IMetaDataOwner {
    spec?: IFunctionSpec;
}

export interface IFunctionSpec {
    handler: string;
    function: string;
    checksum?: string;
    runtime: string;
    type: string;
    topic?: string;
    schedule?: string;
    timeout?: number;
    deps: string;
    service: IServiceSpec;
    deployment: IDeployment;
    // horizontalPodAutoscaler HorizontalPodAutoscaler;
}

export class Lambda extends MetaDataOwner implements IFunction {
    spec?: IFunctionSpec;
    functionStatus?: Observable<number | IDeploymentStatus>;
    constructor(input?: IFunction) {
        super(input.metadata, undefined, input.kind, input.apiVersion);
        this.spec = input.spec;
    }
}
